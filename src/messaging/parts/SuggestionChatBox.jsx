import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import { createTimestamp } from "./create_chat_timestamp";
import { api_post, ACCEPTED_PASSENGERS_URL } from "../../helpers/api.js";

export function SuggestionChatBox(props) {
  const [wlocation, setLocation] = useLocation();
  const [accepted, setAccepted] = useState(false);

  async function acceptSuggestion(user_id, ride_id) {
    const body = {
      "user-id": user_id,
      "ride-id": ride_id,
    };
    setAccepted(true);
    api_post(ACCEPTED_PASSENGERS_URL, body, true);
    props.getRideInfo(ride-id)
  }

  function getDriverBox() {
    if (accepted || props.alreadyPassenger) {
      return (
        <Accepted>Hyväksytty!</Accepted>
      );
    } else {
      return (
        <AcceptDenySuggestion
          denyOrAccept={"accept"}
          onClick={() => acceptSuggestion(props.userID, props.rideID)}
        >
          Hyväksy ehdotus!
        </AcceptDenySuggestion>
      )
    }
  }

  function getPassengerBox() {
    if (accepted || props.alreadyPassenger) {
      return <Accepted>Hyväksytty!</Accepted>;
    } else {
      return <Waiting>Odottaa</Waiting>;
    }
  }

  return (
    <MessageBoxArea whichUser={props.whichUser}>
      <Row>
        <Col xs={6}>Matkaehdotus</Col>
      </Row>
      <Row>
        <Col xs={6}>
          {`${createTimestamp(props.time)}
          ${props.name}
         `}
        </Col>
      </Row>
      <Row>
        <Col>{`${props.origin} - `}</Col>
      </Row>
      <Row>
        <Col>{`${props.destination}`}</Col>
      </Row>
      <Row>
        <Col xs={6}>{props.isDriver ? getDriverBox() : getPassengerBox()}</Col>
      </Row>
    </MessageBoxArea>
  );
}

const AcceptDenySuggestion = styled.div`
  background-color: ${(props) =>
    props.denyOrAccept === "deny" ? "#d64b52" : "#21ad57"};
  padding: 1vh;
  border: none;
  color: #fff;
  border-radius: 0.3rem;
  text-align: center;
  cursor: pointer;
`;

const Waiting = styled.div`
  background-color: orange;
  padding: 1vh;
  border: none;
  color: #fff;
  border-radius: 0.3rem;
  text-align: center;
`;

const Accepted = styled.div`
  background-color: green;
  padding: 1vh;
  border: none;
  color: #fff;
  border-radius: 0.3rem;
  text-align: center;
`;

const MessageBoxArea = styled.div`
  margin-top: 2vh;
  margin-left: ${(props) => (props.whichUser === "sender" ? "20%" : "5%")};
  min-height: 5vh;
  width: 75%;
  padding: 1rem;
  background-color: ${(props) =>
    props.whichUser === "sender" ? "#e0eef3" : "#fafafa"};
  font-size: 2vh;
  -webkit-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
  -moz-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
  box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
  border-radius: 1rem;
`;
