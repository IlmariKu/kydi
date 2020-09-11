import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
const queryString = require("query-string");
import { capitalize } from "lodash";

export function SingleResult(props) {
  const [location, setLocation] = useLocation();
  const [isExternal, setExternal] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rideID, setRideID] = useState(null);

  function createDateString(iso_date) {
    const date = new Date(iso_date);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }

  useEffect(() => {
    if (props.ride) {
      const isExt = props.ride?.external ? true : false;
      const firstN = props.ride?.["first-name"];
      const feedB = props.ride?.["feedback"];
      setExternal(isExt);
      if (firstN) {
        setFirstName(firstN);
      }
      if (feedB) {
        setFeedback(feedB);
      }
    }
  }, [props.ride]);


    async function getRide() {
      const ride_id = queryString.parse(location.search)?.id;
      ride_id = await api_get(`${SEARCH_RIDES_URL}?ride-id=${ride_id}`);
    }


  const clickedChat = () => {
    getRide();
    setLocation(`/viesti?ride=${rideID}`);
    ga("send", "event", "resultView", "clickedChat");
  };



  return (
    <ComponentStyling>
      <div className="singleResult-box">
        {props.ride ? (
          <>
            <div className="singleResult-toprow">
              <i
                className={
                  isExternal
                    ? "fa fa-external-link-square"
                    : "fas fa-user-check"
                }
              ></i>
              {isExternal ? null : (
                <div>
                  <div>{firstName}</div>
                  <div className="reviewItem">{feedback}</div>
                </div>
              )}
              <div>{createDateString(props.ride["departure-date"])}</div>
              <div>{props.ride["departure-time"]}</div>
            </div>

            <div className="singleResult-journey">
              <div className="rideOrigin">
                {" "}
                <i className="far fa-dot-circle"></i>{" "}
                {`${capitalize(props.ride.origin)} ${
                  props.ride["sub-origin"]
                    ? `(${props.ride["sub-origin"].toLowerCase()})`
                    : ""
                }`}{" "}
              </div>
              <div className="rideDestination">
                {" "}
                <i className="fas fa-dot-circle"></i>{" "}
                {`${capitalize(props.ride.destination)}`}
              </div>
            </div>

            <div className="singleResult-bottomrow">
              {isExternal ? (
                <p className="externalText"> Ulkopuolinen</p>
              ) : (
                <button className="chatButton" onClick={() => clickedChat()}>
                  <i className="fas fa-comment-dots"></i>
                </button>
              )}
              <button className="previewButton"> Katso kyytiä </button>
            </div>
          </>
        ) : (
          <div>{JSON.stringify(props.ride)}</div>
        )}
      </div>
    </ComponentStyling>
  );
}

export const ResultBox = {
  minHeight: "80px",
  backgroundColor: "#fff",
  padding: "2rem",
  maxWidth: "100%",
  cursor: "pointer",
};

const ComponentStyling = styled.div`
  font-size: 1.2em;

  .singleResult-box {
    background-color: #fff;
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 1rem;
    -webkit-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    -moz-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    min-height: 7vh;
    padding: 1rem 1.3rem 0.6rem 1rem;
  }

  .singleResult-toprow {
    display: flex;
    justify-content: space-around;
    margin-bottom: 0.5rem;
    align-items: center;
    font-weight: 900;
  }

  .singleResult-journey {
    display: flex;
    flex-direction: column;
  }

  .i.fas.fa-user-check,
  i.fa.external.link.square {
    color: #007e98;
  }

  .rideOrigin {
    color: #6f7682;
    margin-left: 3em;
  }

  .reviewItem {
    color: #21ad57;
  }

  .rideDestination {
    color: #33aec9;
    margin-left: 3em;
  }

  .singleResult-bottomrow {
    display: flex;
    justify-content: flex-end;
    padding: 0.7rem;
    align-items: baseline;
  }

  .chatButton {
    background-color: #fff;
    color: #007e98;
    font-size: 1.2rem;
    border: none;
    padding: 0.2rem 1.2rem 0.2rem 1.2rem;
    border-radius: 0.3rem;
  }

  .externalText {
    font-size: 0.8rem;
    color: #33aec9;
  }

  .previewButton {
    background-color: #007e98;
    color: #fff;
    border-radius: 0.3rem;
    padding: 0.2rem 1rem 0.2rem 1rem;
    border: none;
    margin-left: 0.5rem;
  }
`;
