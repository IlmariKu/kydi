import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import { StartPage } from "./pages/StartPage.jsx";
import { FirstName } from "./pages/FirstName.jsx";
import { UploadPhoto } from "./pages/UploadPhoto.jsx";
import { GiveBiotext } from "./pages/GiveBiotext.jsx";
import { AllReady } from "./pages/AllReady.jsx";
import styled from "styled-components";
import { api_post, UPDATE_PROFILE_INFO_URL } from "../helpers/api.js";

export function NewUser(props) {
  const [location, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState(null);
  const [biotext, setBiotext] = useState("");

  function setNextPage(prevNext, existFirstName) {
    let newpage;
    if (page === 1 && existFirstName){
      newpage = 3
    } else if (prevNext === "next") {
      newpage = page + 1;
      ga("send", "event", "newUser", "nextPage", newpage);
      if (newpage === 5) {
        updateLastLoginInfo(props.userID);
      }
    } else if (prevNext === "prev") {
      newpage = page - 1;
      ga("send", "event", "newUser", "prevPage", newpage);
    }
    setPage(newpage);
  }

  function updateLastLoginInfo(user_id) {
    const body = {
      "user-id": user_id,
      biotext: biotext,
    };
    if (firstName){
      body["first-name"] = firstName
    }
    api_post(`${UPDATE_PROFILE_INFO_URL}/?user-id=${user_id}`, body, true);
  }

  const questions = [
    "",
    "",
    "Mikä on etunimesi?",
    "Kerro jotain itsestäsi!",
    "Lataa profiilikuva",
  ];

  return (
    <NewUserStyles>
      <div className="component-background-ride-view">
      {page < 5 && page > 1 ? (
        <div>
          <div
            style={{ fontSize: "3vh", textAlign: "center" }}
          >{`Kysymys ${page-1}/3`}</div>
        </div>
      ) : null}
      <div style={{ height: "1vh" }}></div>
      <PageQuestion>{questions[page]}</PageQuestion>
      {page === 5 ? (
        <div style={{ fontSize: "2vh", textAlign: "center" }}>
        </div>
      ) : null}
      <QuestionPageStyle>
        {page === 1 ? <StartPage existFirstName={props.firstName} /> : null}
        {page === 2 ? (
          <FirstName firstName={firstName} setFirstName={setFirstName} />
        ) : null}
        {page === 3 ? (
          <GiveBiotext biotext={biotext} setBiotext={setBiotext} />
        ) : null}
        {page === 4 ? <UploadPhoto userID={props.userID} /> : null}
        {page === 5 ? <AllReady /> : null}
      </QuestionPageStyle>
      <div>
        <Button
          onClick={() => (page === 5 ? setLocation("/") : setNextPage("next", props.firstName))}
          type="submit"
          className={"btn-searchform"}
          block
        >
          {page === 5 ? "Palaa hakuun!" : "Seuraava"}
        </Button>
      </div>
      </div>
    </NewUserStyles>
  );
}

const NewUserStyles = styled.div`
  p {
    font-size: 2.4vh;
  }
`;

const QuestionPageStyle = styled.div`
  font-size: 5vh;
  text-align: center;
  margin-bottom: 2vh;
`;

const PageQuestion = styled.div`
  font-size: 4vh;
  text-align: center;
`;
