import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
const queryString = require("query-string");
import { SingleFeedback } from "./SingleFeedback.jsx";
import { UploadPicture } from "./UploadPicture.jsx";
import { SVGCrossIcon } from "../../static/icons/SVGCrossIcon.js";
import { SVGCheckmark } from "../../static/icons/SVGCheckmark.js";
import { SVGQuestion } from "../../static/icons/SVGQuestion.js";
import {
  api_post,
  api_get,
  UPDATE_PROFILE_INFO_URL,
  GET_PROFILE_INFO_URL,
  S3_BASE_URL,
  GET_REVIEWS_URL,
} from "../helpers/api.js";
import { biotext_placeholder } from "../helpers/texts.js";

export function Profile(props) {
  const [lastLogin, setLastLogin] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [biotext, setBioText] = useState("");
  const [profilePicture, setProfilePicUrl] = useState(null);
  const [isOwnProfile, setOwnProfile] = useState(false);
  const [feedbackShort, setFeedbackShort] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const [facebookUser, setFacebookUser] = useState(false);
  const [biotextModified, setBiotextModified] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  function saveProfileChanges() {
    const data = {};
    data.biotext = document.getElementById("biotext").value;
    data["user-id"] = props.userID;
    api_post(UPDATE_PROFILE_INFO_URL, data, true);
    setChangesSaved(true);
    setBiotextModified(false);
  }

  function createWhenLoggedInText(lastLoginDate) {
    const raw_last_login = new Date(lastLoginDate);
    const now = new Date();
    const diffTime = Math.abs(now - raw_last_login);
    const lastLoginDaysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (lastLoginDaysAgo === 1) {
      return "Tänään";
    } else if (lastLoginDaysAgo === 2) {
      return "Eilen";
    } else {
      return `${lastLoginDaysAgo + 1} päivää sitten`;
    }
  }

  async function getReviews(user_id) {
    const reviews = await api_get(
      `${GET_REVIEWS_URL}?user-id=${user_id}`,
      true
    );
    const rawReviews = reviews?.reviews;
    if (!rawReviews) {
      return;
    }
    const parsedReviews = JSON.parse(rawReviews);
    setFeedbackShort(parsedReviews.length);
    const reviewsElements = rawReviews.map(function (review) {
      return (
        <SingleFeedback
          stars={review["star-review"]}
          text={review["text-review"]}
        />
      );
    });
    setAllReviews(<div>{reviewsElements}</div>);
  }

  async function getProfileInfo(user_id) {
    const profile = await api_get(
      `${GET_PROFILE_INFO_URL}?user-id=${user_id}`,
      true
    );
    const last_login = profile?.["last-login"];
    const picUrl = profile?.["profile-picture-url"];
    const biotext = profile?.biotext;
    const first_name = profile?.["first-name"];
    if (last_login) {
      setLastLogin(createWhenLoggedInText(last_login));
    }
    if (picUrl) {
      setProfilePicUrl(`${S3_BASE_URL}${picUrl}`);
    }
    if (biotext) {
      setBioText(biotext);
    }
    if (first_name) {
      setFirstName(first_name);
    }
  }

  function noQueryWasGiven(user_id, ownID) {
    return user_id === undefined || (user_id === "undefined" && ownID);
  }

  function handleIncomingQueryString() {
    const user_id = queryString.parse(location.search)?.id;
    const ownID = sessionStorage.getItem("userID");
    if (ownID && ownID.includes("Facebook")) {
      setFacebookUser(true);
    }
    if (noQueryWasGiven(user_id, ownID)) {
      getProfileInfo(ownID);
      getReviews(ownID);
      setOwnProfile(true);
    } else if (user_id) {
      getProfileInfo(user_id);
      getReviews(user_id);
    } else {
      console.error("Invalid querystring-operation");
    }
  }

  const confirmedInfo = [
    "Sähköposti",
    "Facebook",
    "Puhelin",
    "Auton tiedot",
  ].map(function (field) {
    return (
      <Row key={field}>
        <Col>{field}</Col>
        <Col>
          {(field === "Facebook" && facebookUser) ||
          (field === "Sähköposti" && !facebookUser) ? (
            <SVGCheckmark />
          ) : (
            <SVGCrossIcon />
          )}
        </Col>
      </Row>
    );
  });

  useEffect(() => {
    handleIncomingQueryString();
  }, [location.href]);

  return (
    <div className="component-background">
      <div style={{ fontSize: "3vh", width: "90%", marginLeft: "5%" }}>
        <div>
          <Row style={{ marginBottom: "1.2rem" }}>
            <Col xs={1}>
              <i
                className="fas fa-arrow-left"
                onClick={() => window.history.back()}
              ></i>
            </Col>
            <Col xs={4}>
              {profilePicture ? (
                <img
                  src={profilePicture}
                  style={{
                    width: "11vh",
                    height: "11vh",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <SVGQuestion />
              )}
            </Col>
            <Col xs={6}>
              <Row>{firstName ? firstName : "Nimetön"}</Row>
              <Row>
                <RegisteredOn>{`Kirjautunut viimeksi: ${lastLogin} `}</RegisteredOn>
              </Row>
              <Row>
                <RegisteredOn>
                  {"Palaute: "}
                  <span style={{ color: "green", fontSize: "3vh" }}>
                    {feedbackShort}
                  </span>
                </RegisteredOn>
              </Row>
            </Col>
          </Row>
          <Row>
            {isOwnProfile ? (
              <UploadPicture
                userID={props.userID}
                setProfilePicUrl={setProfilePicUrl}
              />
            ) : null}
          </Row>
          {confirmedInfo}
          <div style={{ minHeight: "4vh" }}></div>
          {"Minusta"}
          {isOwnProfile ? (
            <Form>
              <Form.Group controlId="biotext">
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={6}
                  defaultValue={biotext}
                  placeholder={biotext_placeholder}
                  onChange={() => setBiotextModified(true)}
                  style={{ fontSize: "2vh" }}
                />
              </Form.Group>
            </Form>
          ) : (
            <BorderWithText>
              {biotext ? biotext : "Käyttäjä ei ole kertonut itsestään mitään."}
            </BorderWithText>
          )}
          <div style={{ minHeight: "5vh" }}></div>
          {isOwnProfile ? "Palautteesi: " : "Palaute: "}{" "}
          <span>{`${feedbackShort} kpl`}</span>
          <div style={{ minHeight: "2vh" }}></div>
          <BorderWithText>{allReviews}</BorderWithText>
          {
            changesSaved && !biotextModified ? (
              <div style={{"color": "green"}}>Muutokset tallennettu!</div>
            ) : (
          isOwnProfile && biotextModified ? (
            <Button
              block
              onClick={() => saveProfileChanges()}
              className={"btn-searchform"}
            >
              Tallenna muutokset
            </Button>
          ) : null
          )}
        </div>
      </div>
    </div>
  );
}

const BorderWithText = styled.div`
  border-top: solid;
  border-width: 2px;
  padding-top: 1vh;
  font-size: 2vh;
`;

const RegisteredOn = styled.div`
  font-size: 2vh;
`;
