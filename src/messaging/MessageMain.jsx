import React, { useState, useEffect, useRef } from "react";
const queryString = require("query-string");
import { MessageBox } from "./parts/MessageBox.jsx";
import { SuggestionChatBox } from "./parts/SuggestionChatBox.jsx";
import { useLocation, Link } from "wouter";
import { generateRandomID } from "../helpers/create_random_id.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import { isEmpty } from "lodash";
import {
  api_post,
  api_get,
  SEND_MESSAGE_URL,
  POLL_MESSAGE_URL,
  SEARCH_RIDES_URL,
} from "../helpers/api.js";
import { cutShortUsername } from "../helpers/shortUserID.js";
import { convertDateToString } from "../helpers/date.js";
import { capitalize } from "lodash";

var participants;
var passengers;

const POLL_LIMIT = 5;
const POLL_WAIT = 18000;

const userID = sessionStorage.getItem("userID");

export function MessageMain(props) {
  const [wouter_location, setLocation] = useLocation();
  const [message, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [rideID, setRideID] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDriver, setIsDriver] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [ehdotaState, setEhdotaState] = useState(null);

  function clickedEhdota(ride_id) {
    setLocation(`/ehdota?ride=${ride_id}`);
    ga("send", "event", "suggestview", "openedSuggestions");
  }

  async function getPreviousMessages(ride_id, ignoreTimeout = false) {
    if (!ride_id) {
      console.error("Ride-ID could not be read");
      return;
    }
    const response = await api_get(
      `${POLL_MESSAGE_URL}?ride-id=${ride_id}`,
      true
    );
    participants = response["people-in-chat"];
    setLoadingSuggestions(false);

    if (!isEmpty(response.messages)) {
      const oldMessages = createMessageBoxes(response);
      setAllMessages(oldMessages);
    } else {
      setAllMessages([<div key={"nomessages"}>Ei viestejä</div>]);
    }
    scrollToNewMessages();
  }

  function createMessageBoxes(response) {
    const messages = JSON.parse(response.messages);
    const messageBoxes = messages.map(function (msg) {
      return createNewMessageBox(msg, response);
    });
    return messageBoxes;
  }

  async function sendNewMessage(firstName) {
    event.preventDefault();
    if (message === "") {
      return;
    }
    ga("send", "event", "messages", "sentNewMessage");
    const body = {
      "ride-id": rideID,
      "sender-id": cutShortUsername(userID),
      type: "text",
      content: message,
      "first-name": firstName,
    };
    const response = await api_post(`${SEND_MESSAGE_URL}`, body, true);
    const new_boxes = createMessageBoxes(response);
    setAllMessages(allMessages.concat(new_boxes));
    setNewMessage("");
    scrollToNewMessages();
  }

  function scrollToNewMessages() {
    const msg_box = document.getElementById("messageSetter");
    msg_box.scroll({
      top: msg_box.scrollHeight,
      behavior: "smooth",
    });
  }

  async function getRideInfo(ride_id) {
    const ridelist = await api_get(`${SEARCH_RIDES_URL}?ride-id=${ride_id}`);
    const ride = ridelist[0];
    setOrigin(ride.origin);
    setDestination(ride.destination);
    setDeparture(convertDateToString(new Date(ride["departure-date"]), true));
    if (ride["user-id"] === userID) {
      setIsDriver(true);
    } else {
      setIsDriver(false);
    }
    if (ride?.passengers) {
      // TODO: Fix eval()-use, totally should not be implemented like this, but too close to MVP-release
      passengers = eval(ride.passengers);
    }
    setDriverName(ride["first-name"]);
  }

  function createNewMessageBox(msg, ride) {
    const randomID = generateRandomID();
    const sender_id = msg?.["sender-id"];
    const msgProps = {
      whichUser: sender_id === cutShortUsername(userID) ? "sender" : "other",
      isDriver: ride["sender-id"] === sender_id,
      participants: participants,
      name: participants?.[sender_id]
        ? participants[sender_id]["first-name"]
        : props.firstName,
      time: msg?.date,
      userID: sender_id,
      key: randomID,
      id: randomID,
      rideID: ride["ride-id"],
    };
    const alreadyPassenger = passengers
      ? passengers.includes(cutShortUsername(userID))
      : false;

    if (msg["type"] === "text") {
      return <MessageBox {...msgProps} content={msg?.content} />;
    } else if (msg["type"] === "suggestion") {
      return (
        <SuggestionChatBox
          {...msgProps}
          origin={msg["origin"]}
          destination={msg["destination"]}
          getRideInfo={getRideInfo}
          alreadyPassenger={alreadyPassenger}
        />
      );
    }
  }

  useEffect(() => {
    const ride_id = rideID;
    const interval = setInterval(() => {
      getPreviousMessages(ride_id);
    }, POLL_WAIT);
    return () => clearInterval(interval);
  }, [rideID]);

  useEffect(() => {
    const ride_id = queryString.parse(location.search)?.ride;
    if (ride_id) {
      setLoading(true);
      setRideID(ride_id);
      getPreviousMessages(ride_id);
      getRideInfo(ride_id);
      setLoading(false);
      scrollToNewMessages();
    }
  }, [rideID]);

  useEffect(() => {
    const isLoading = queryString.parse(location.search)?.load;
    if (isLoading) {
      setLoadingSuggestions(true);
    } else {
      setLoadingSuggestions(false);
    }
  }, [location.href]);

  return (
    <>
      <TopMenuBar>
        <OverviewTexts>
          <div>{`${capitalize(origin)} - ${capitalize(destination)} ${departure}`}</div>
          {isDriver ? null : <div>{`Kuljettaja: ${driverName}`}</div>}
        </OverviewTexts>
        {/* {ehdotaState === "is_driver" ? null : <Button onClick={() => clickedEhdota(rideID)} className="btn-profile">
        Ehdota!
      </Button>} */}
        {/* {ehdotaState === "already_passenger" ? <div>Olet jo mukana</div> : null}
        {loadingSuggestions ? <Spinner animation="border" /> : null} */}
      </TopMenuBar>
      <MessageArea id={"messagebox-area"}>
        <GuideMessage>
          {isDriver
            ? `Tässä ruudussa ihmiset voivat kysellä sinulta matkaan liittyviä kysymyksiä ja tehdä ehdotuksen noutopaikasta.`
            : `Tässä voit jutella kuljettajan ja muiden kyytiläisten kanssa. Kysy kuskilta mistä hän ajaa ja ehdota hänelle lähtöpaikkaa, kun olet valmis.`}
        </GuideMessage>
        {loading ? (
          <h1>Ladattaaa</h1>
        ) : (
          <div id="messageSetter" className="messageSetter">
            {allMessages}
          </div>
        )}

        <WriteMessageHere>
          <Form
            autoComplete="off"
            onSubmit={() => sendNewMessage(props.firstName)}
          >
            <Form.Row className="align-items-center">
              <Col xs="auto">
                <Form.Label htmlFor="inlineFormInput" srOnly>
                  Name
                </Form.Label>
                <Form.Group name="newmessage" controlId="chat">
                  <Form.Control
                    onChange={() => setNewMessage(event.target.value)}
                    value={message}
                    disabled={
                      rideID && props.firstName && props.userID ? false : true
                    }
                    placeholder="Kirjoita viesti..."
                    size="md"
                    type="text"
                  />
                </Form.Group>
              </Col>

              <Col xs="auto">
                <Button
                  onSubmit={() => sendNewMessage(props.firstName)}
                  disabled={rideID && props.firstName && userID ? false : true}
                  type="submit"
                  className="mb-2"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </WriteMessageHere>
      </MessageArea>
      <div style={{ fontSize: "2vh", color: "red" }}>
        {rideID ? "" : "Jokin on vialla. Kokeile päivittää sivu"}
      </div>
      <div style={{ fontSize: "2vh", color: "red" }}>
        {props.firstName ? (
          ""
        ) : (
          <span>
            Et ole asettanut etunimeäsi.{" "}
            <Link href="/uusi-kayttaja">Klikkaa tästä</Link> asettaaksesi sen.
          </span>
        )}
      </div>
    </>
  );
}

const OverviewTexts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 2vh;
`;

const GuideMessage = styled.div`
  color: grey;
  margin: 2vh;
  min-height: 5vh;
  width: 96%;
  font-size: 2vh;
  border-bottom: 1px solid grey;
`;

const TopMenuBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 7vh;
  width: 100%;
  padding: 0.4rem;
  background: linear-gradient(
    78deg,
    rgba(0, 126, 152, 1) 7%,
    rgba(12, 139, 177, 1) 100%
  );
  color: #fff;
  font-size: 3vh;
  border-radius: 0.2rem;
  -webkit-box-shadow: 0px 6px 5px -6px rgba(147, 149, 156, 1);
  -moz-box-shadow: 0px 6px 5px -6px rgba(147, 149, 156, 1);
  box-shadow: 0px 6px 5px -6px rgba(147, 149, 156, 1);
`;

const MessageArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: auto;
  background-color: #f0f5f7;
  border-radius: 0rem 0rem 0.2rem 0.2rem;
  overflow: auto;
  -webkit-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
  -moz-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
  box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);

  .messageSetter {
    min-height: 7em;
    max-height: 40vh;
    overflow-y: scroll;
    margin: 1rem;
  }

  .align-items-center {
    -ms-flex-align: center !important;
    display: flex;
    justify-content: center;
    align-items: center !important;
    border-radius: 0 0 0.2 0.2;
  }

  .col-auto {
    max-width: 80%;
  }

  .btn-primary {
    background-color: #f0f5f7;
    border: none;
    color: #285367;
    font-size: 1em;
  }

  .btn-primary:hover {
    color: #71e0fc;
  }

  @media (min-width: 576px) {
    .form-control {
      height: 2em;
    }

    .btn-primary {
      font-size: 2em;
    }
  }

  @media (min-width: 876px) {
    .btn-primary {
      font-size: 1.6em;
    }
  }
`;

const WriteMessageHere = styled.div`
  .form-control {
    border: none;
    border-radius: 0.2;
  }
`;
