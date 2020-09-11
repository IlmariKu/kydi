import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
const queryString = require("query-string");
import { capitalize } from "lodash";

import { api_get, SEARCH_RIDES_URL } from "../helpers/api.js";

export function Ride(props) {
  const [wouter_location, setLocation] = useLocation();
  const [driverID, setDriverID] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submittedOn, setSubmittedOn] = useState(null);
  const [rideText, setText] = useState(null);
  const [rideID, setRideID] = useState(null);
  const [isExternal, setExternal] = useState(null);
  const [link, setLink] = useState(null);

  function clickedMessage() {
    ga("send", "event", "rideView", "openedMessages");
    setLocation(`/viesti?ride=${rideID}`);
  }

  function clickedProfile() {
    ga("send", "event", "rideView", "openedProfile");
    setLocation(`/profiili?id=${driverID}`);
  }

  function clickedReturn() {
    ga("send", "event", "rideView", "returned");
    window.history.back();
  }

  function convertDateToString(date) {
    const days = [
      "Sunnuntai",
      "Maanantai",
      "Tiistai",
      "Keskiviikko",
      "Torstai",
      "Perjantai",
      "Lauantai",
    ];
    return `${days[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}`;
  }

  async function getRideInfo(ride_id) {
    const ridelist = await api_get(`${SEARCH_RIDES_URL}?ride-id=${ride_id}`);
    const ride = ridelist[0]
    setRideID(ride_id);
    setDriverID(ride["user-id"]);
    setOrigin(ride["origin"]);
    setDestination(ride["destination"]);
    setText(ride["text"]);
    setFirstName(ride["first-name"]);
    setFeedback(ride["feedback"]);
    setSubmittedOn(ride["time-submitted"]);
    setDepartureTime(ride["departure-time"]);
    setLink(ride["link"]);
    setExternal(ride?.external ? true : false);
    const aika = new Date(ride["departure-date"]);
    setDepartureDate(convertDateToString(aika));
    return ride;
  }

  function clickedMustLogin(){
    ga("send", "event", "rideView", "clickedMustLogin");
    sessionStorage.setItem("redirect_route", `/kyyti/${rideID}`);
    setLocation("/kirjaudu")
  }


  useEffect(() => {
    const ride_id = queryString.parse(location.search)?.id;
    getRideInfo(ride_id);
  }, []);

  return (
    <div
      className="component-background-single-ride-view"
      data-aos="flip-right"
      data-aos-delay="200"

    >
      <RideArea>
        <div className="component-background-ride-bg-view">
          <div className="topContent">
            <i
              className="fas fa-arrow-left"
              onClick={() => clickedReturn()}
            ></i>

            <h4 className="rideTopText"> Kyydin tiedot </h4>
          </div>
          <div className="rideTopAreaContent">
            <div className="rideOrigin">
              <i className="far fa-dot-circle"></i>
              {`${capitalize(origin)}`}
            </div>

            <div className="rideDestination">
              <i className="fas fa-dot-circle"></i> {`${capitalize(destination)}`}
            </div>

            <div className="rideTime">
              {`${departureDate} - ${departureTime}`}
            </div>
          </div>
        </div>
        <div className="ridePageContent">
          {isExternal ? (
            props.isLoggedIn ? (
            <div className="externalLink">
              <i className="fab fa-facebook"></i> {" "}
              Ilmoitus löytyy Facebookista <a href={link}>{`${link}`}</a>
            </div>
            ) : <div style={{"textAlign": "center"}}>Sinun täytyy <Link onClick={() => clickedMustLogin()}>kirjautua sisään</Link> nähdäksesi tarkemmat matkan tiedot</div>
          ) : (
            <>
            <h4 className="profileItems-poster"> Ilmoittajan tiedot </h4>
            <div className="rideProfile">
                <div className="profileItems">

                <div>{firstName ? firstName : ""} </div>
                {/* <div>
                  {" "}
                  <span style={{ color: "black" }}>Ei palautteita.</span>{" "}
                </div> */}

                <Button
                  className={"btn-profile"}
                  onClick={() => clickedProfile()}
                >
                  Profiili
                </Button>
              </div>
            </div>
            </>
          )}

          <div className="fillerText">
            <h4 className="profileItems-poster "> Kyydin tiedot </h4>
            <div className="rideInfo">
            {rideText}
             </div>
            {isExternal ? (
              <div>
                Tämä matka löytyy ulkoisesta lähteestä. Ota yhteyttä
                ilmoittajaan ylläolevan linkin kautta. {" "}
              </div>
            ) : (
              <Button
                className={"btn-sendmessage"}
                onClick={() => clickedMessage()}
              >
                Lähetä viesti <i className="fas fa-envelope"></i>
              </Button>
            )}
          </div>
        </div>
      </RideArea>
    </div>
  );
}

const RideArea = styled.div`
  font-size: 1.2rem;

  .topContent {
    display: inline-flex;
    border-bottom: 1px solid white;
    width: 100%;
    margin-bottom: 1rem;
  }

  .fa-arrow-left {
    color: #fff;
  }

  .fa-arrow-left:hover {
    color: #39dadf;
  }

  .rideTopText {
    padding: 0 0 0 2rem;
  }

  .rideTopArea {
    background-image: linear-gradient(
        90deg,
        rgba(0, 126, 152, 0.7) 0%,
        rgba(58, 200, 230, 0.7) 100%
      ),
      url("../static/ridepic.jpg");
    background-size: cover;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .rideTopAreaContent {
    margin-left: 4.5em;
  }

  .rideOrigin {
    color: #fff;
  }

  .rideDestination {
    color: #fafafa;
  }

  .ridePageContent {
    padding: 2rem;
  }

  .fillerText {
    font-size: 1.05rem;
    padding: 1rem;
    width: 100%;
    margin-top: 1rem;
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
  }

  .externalLink {
    text-align: center;
  }

  .rideProfile {
    padding: 1.5rem;
    display: inline-flex;
    width: 100%;
  }
  .profileItems {
    justify-content: space-between;
    display: inline-flex;
    width: 100%;
  }

  .profileItems-poster {
    border-bottom: 1px solid #e4e8e8;
    width: 100%;
    text-align: center;
  }

  .rideInfo {
    padding: 1rem;
  }
`;
