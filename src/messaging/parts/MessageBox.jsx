import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import { createTimestamp } from "./create_chat_timestamp.js";

export function MessageBox(props) {
  const [location, setLocation] = useLocation();
  const [firstName, setFirstName] = useState("Etunimi");

  useEffect(() => {
    const firstPropsName = setFirstName(
      props.participants?.[props.userID]?.["first-name"]
    );
    if (firstPropsName) {
      setFirstname(firstPropsName);
    } else if (props.firstName) {
      setFirstName(props.firstName);
    }
  }, [props.userID && props.participants]);
  return (
    <MessageBoxArea
      whichUser={props.whichUser}
      onClick={() =>
        setLocation(
          `/profiili?id=${props.participants?.[props.userID]?.["sender-id"]}`
        )
      }
    >
      <div className="senderStamp">
        {`${createTimestamp(props.time)}
          ${firstName ? firstName : ""}
         `}
      </div>
      <div className="senderMessage"> {props.content}</div>
    </MessageBoxArea>
  );
}
const MessageBoxArea = styled.div`
  margin-top: 2vh;
  margin-left: ${(props) => (props.whichUser === "sender" ? "20%" : "5%")};
  min-height: 5vh;
  width: 75%;
  padding: 1rem;
  background-color: ${(props) =>
    props.whichUser === "sender" ? "#a0e6ff" : "#e0eef3"};
  font-size: 2vh;
  border-radius: 1.5rem;
`;
