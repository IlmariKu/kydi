import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import { OriginCity } from "./pages/OriginCity.jsx";
import { WhenLeaving } from "./pages/DepartureTime.jsx";
import { DestinationCity } from "./pages/DestinationCity.jsx";
import { NewPostText } from "./pages/NewPostText.jsx";
import { SubOrigin } from "./pages/SubOrigin.jsx";
import { Review } from "./pages/Review.jsx";
import { Finished } from "./pages/Finished.jsx";
import styled from "styled-components";
import { api_post, POST_NEW_RIDE_URL, UPDATE_PROFILE_INFO_URL, POST_NEW_REQUEST_URL } from "../helpers/api";

export function NewRide(props) {
  const [location, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [whenLeavingDate, setWhenLeavingDate] = useState("");
  const [whenLeavingTime, setWhenLeavingTime] = useState("Ei valittua aikaa");
  const [postText, setPostText] = useState("");
  const [subOrigin, setSubOrigin] = useState("");
  const [rideID, setRideID] = useState(null);

  async function sendRide(requestOrRide) {
    setPage(7);

    const form = {
      destination: props.destinationField.toLowerCase(),
      origin: props.originField.toLowerCase(),
      "departure-date": whenLeavingDate,
      "departure-time": whenLeavingTime,
      "user-id": props.userID,
      "sub-origin": subOrigin,
      text: postText,
      "first-name": props.firstName,
    };
    if (props.feedback){
      body["feedback"] = props.feedback
    }
      const rideInfo = await api_post(
        requestOrRide === "request"
          ? POST_NEW_REQUEST_URL
          : requestOrRide === "ride"
          ? POST_NEW_RIDE_URL
          : null,
        form,
        true
      );
      props.setOriginField("")
      props.setDestinationField("")
      const ride_id = rideInfo[0]["ride-id"]
      console.log(ride_id)
      setRideID(ride_id)
      if (requestOrRide === "ride"){
        await api_post(
          UPDATE_PROFILE_INFO_URL,
          {
            "my-rides": [ride_id],
            "user-id": props.userID
        },
          true
        );
      }
  }

  function setNextPage(prevNext) {
    let newpage;
    if (prevNext === "next") {
      newpage = page + 1;
      ga("send", "event", "newRide", "nextPage", newpage);
    } else if (prevNext === "prev") {
      newpage = page - 1;
      ga("send", "event", "newRide", "prevPage", newpage);
    }
    setPage(newpage);
  }

  useEffect(() => {
    if (props.userID === null) {
      sessionStorage.setItem("redirect_route", "/ilmoita");
      setLocation("/kirjaudu?r=na");
    }
  }, []);

  const questions = [
    "",
    "Mistä lähdet?",
    "Kuvaa tarkemmin mistä lähdet",
    "Mihin olet matkalla?",
    "Milloin lähdet?",
    "Vapaa teksti",
    props.requestOrRide === "ride" ? "Uusi matkailmoitus" : "Uusi matkapyyntö",
    "Olet valmis!",
  ];

  return (
    <div className="component-background-ride-view ">
      <i
        className="fas fa-arrow-left"
        onClick={() => (page === 1 || page === 7 ? setLocation("/") : setPage(page - 1))}
      ></i>
      {page < 6 ? (
        <div>
          <div
            style={{ fontSize: "3vh", textAlign: "center" }}
          >{`Kysymys ${page}/5`}</div>
        </div>
      ) : null}
      <div style={{ height: "1vh" }}></div>
      <PageQuestion>{questions[page]}</PageQuestion>
      <div style={{ height: "7vh" }}></div>
      <QuestionPageStyle>
        {page === 1 ? (
          <OriginCity
            setOriginField={props.setOriginField}
            originField={props.originField}
          />
        ) : null}
        {page === 2 ? <SubOrigin setSubOrigin={setSubOrigin} requestOrRide={props.requestOrRide} /> : null}
        {page === 3 ? (
          <DestinationCity
            destinationField={props.destinationField}
            setDestinationField={props.setDestinationField}
          />
        ) : null}
        {page === 4 ? (
          <WhenLeaving
            whenLeavingDate={whenLeavingDate}
            setWhenLeavingDate={setWhenLeavingDate}
            whenLeavingTime={whenLeavingTime}
            setWhenLeavingTime={setWhenLeavingTime}
          />
        ) : null}
        {page === 5 ? (
          <NewPostText
            postText={postText}
            setPostText={setPostText}
            requestOrRide={props.requestOrRide}
          />
        ) : null}
        {page === 6 ? (
          <div>
            <Review
              sendRide={sendRide}
              subOrigin={subOrigin}
              originField={props.originField}
              destination={props.destinationField}
              whenLeavingTime={whenLeavingTime}
              whenLeavingDate={whenLeavingDate}
              postText={postText}
              requestOrRide={props.requestOrRide}
            />
          </div>
        ) : null}
        {page === 7 ? <Finished rideID={rideID} /> : null}
      </QuestionPageStyle>
      <div>
        {page < 6 ? (
          <div>
            <div style={{ minHeight: "8vh" }}></div>
            <Button
              onClick={() => setNextPage("next")}
              type="submit"
              disabled={
                (page === 3 && !props.destinationField) ||
                (page === 4 && !whenLeavingDate)
              }
              className={"btn-searchform"}
              block
            >
              Seuraava
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const QuestionPageStyle = styled.div`
  font-size: 5vh;
  text-align: center;
`;

const PageQuestion = styled.div`
  font-size: 4vh;
  text-align: center;
`;
