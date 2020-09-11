import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import { zip } from "lodash";
import {
  api_post,
  SEND_MESSAGE_URL,
  POLL_MESSAGE_URL,
} from "../../helpers/api.js";
import { cutShortUsername } from "../../helpers/shortUserID.js";
const queryString = require("query-string");

const shortUserID = cutShortUsername(sessionStorage.getItem("userID"));

export function MessageSuggestion(props) {
  const [wouterlocation, setLocation] = useLocation();
  const [rideID, setRideID] = useState(null);

  function clickedReturn() {
    ga("send", "event", "suggestionView", "returned");
    window.history.back();
  }

  function onSubmit(ride_id) {
    const suggestion = {
      origin: document.getElementById("origin").value,
      destination: document.getElementById("destination").value,
      time: document.getElementById("time").value,
      "first-name": props.firstName,
      "ride-id": ride_id,
      "sender-id": shortUserID,
      type: "suggestion",
    };
    ga("send", "event", "messages", "sentNewSuggestion");
    api_post(`${SEND_MESSAGE_URL}`, suggestion, true);
    setLocation(`/viesti/?ride=${ride_id}&load=true`);
  }

  const formFields = zip(
    ["origin", "destination", "time", "price"],
    ["Hakupaikka", "Määränpää", "Kellonaika", "Polttoainekorvaus"],
    [
      "fas fa-map-marker-alt",
      "fas fa-map-marked-alt",
      "fa fa-clock-o",
      "fas fa-hand-holding-usd",
    ]
  ).map(function (values) {
    return (
      <ProfileLinkArea key={`p_${values[0]}`}>
        <i key={`i_${values[0]}`} className={values[2]}></i>
        <Form.Control
          type="text"
          name={values[0]}
          key={values[0]}
          id={values[0]}
          placeholder={values[1]}
        />
      </ProfileLinkArea>
    );
  });

  useEffect(() => {
    const ride_id = queryString.parse(location.search)?.ride;
    setRideID(ride_id);
  }, [location.href]);

  return (
    <div className="component-background2">
      <RideArea>
        <div style={{ textAlign: "center" }}>
          <Row>
            <Col xs={2}>
              <i
                className="fas fa-arrow-left"
                onClick={() => clickedReturn()}
              ></i>
            </Col>
            <Col xs={9}>
              <h4 className="titleSuggest"> Ehdota kyytiä! </h4>{" "}
            </Col>
          </Row>
        </div>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}></Col>
          <Col xs={1}></Col>
        </Row>
        <div style={{ minHeight: "2vh" }}></div>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}>
            <div className="formItems">
              <Form autoComplete="off">{formFields}</Form>
            </div>

            <p className="infoText">
              Kydi ei vastaa mihinkään polttoainekorvauksiin liittyvästä. Sinun
              on hoidettava maksaminen itse kuljettajan kanssa.
            </p>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <div style={{ height: "2vh" }}></div>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}></Col>
          <Col xs={1}></Col>
        </Row>
       
        <div className="button-holder"> 

          <Button
            className={"btn-sendmessage"}
            onClick={() => onSubmit(rideID)}
          >
            Lähetä ehdotus
          </Button>

          </div> 
        
        <div style={{ height: "5vh" }}></div>
      </RideArea>
      <div style={{ height: "5vh" }}></div>
    </div>
  );
}

const ProfileLinkArea = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  min-height: 7vh;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  border: 1px solid lightgrey; 
  border-radius: 0.5rem;
  box-shadow: 0px 3px 13px -17px rgba(138, 138, 138, 0.55);

  .form-control {
    border: none;
    margin-bottom: 0.7rem;
  }

  i {
    color: darkgrey;
  }

  .button-holder {
    display-flex; 
    align-self: center; 
  }
`;

const RideArea = styled.div`
  font-size: 3vh;
  background-color: white;
  min-height: 70vh;
  width: 90%;
  margin-left: 5%;
  border-radius: 20px;
  padding: 1rem;

  .titleSuggest {
    border-bottom: 1px solid #fafafa;
  }

  .form-control {
    height: 6vh;
    margin-bottom: 1rem;
  }

  .infoText {
    font-size: 1rem;
    color: #007e98;
  }
`;

const BioHeadline = styled.div`
  font-size: 2vh;
`;

const BorderWithText = styled.div`
  border-top: solid;
  border-width: 2px;
  padding-top: 1vh;
  font-size: 2vh;
`;

const ProfileItems = styled.div`
  justify-content: center;
  align-items: center;
`;
