import React, { useState, useEffect } from "react";
import { SingleResult } from "./SingleResult.jsx";
import { NoRideFound } from "./NoRideFound.jsx";
import { useLocation } from "wouter";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import { isEmpty } from "lodash";
import queryString from "query-string";
import { api_get, SEARCH_RIDES_URL } from "../helpers/api.js";

export function SearchResultView(props) {
  const [allRides, setAllRides] = useState(null);
  const [wlocation, setLocation] = useLocation();
  const [searchLoading, setSearchLoading] = useState(true);

  function createRides(results) {
    if (!results || !Array.isArray(results)) {
      setAllRides(null);
      return;
    }
    const allRides = results.map(function (ride) {
      const now = new Date();
      now.setHours(0, 0, 0, 0)
      const rideHappened = new Date(ride["departure-date"]);
      if (now > rideHappened){
        return
      }
      return (
        <div
          key={`result_click${ride["ride-id"]}`}
          onClick={() => clickedRide(ride["ride-id"])}
        >
          <SingleResult key={ride["ride-id"]} ride={ride} />
        </div>
      );
    });
    setAllRides(allRides);
  }

  function clickedReturn() {
    ga("send", "event", "resultView", "returnedToSearch");
    setAllRides(null);
    setLocation("/")
  }

  function clickedRide(ride_id) {
    setLocation(`/kyyti?id=${ride_id}`);
    ga("send", "event", "resultView", "openedRide");
  }

  async function getRides(query) {
    const results = await api_get(`${SEARCH_RIDES_URL}${query}`);
    createRides(results)
    setSearchLoading(false);
  }

  useEffect(() => {
    setSearchLoading(true);
    getRides(location.search);
  }, []);

  return (
    <ResultArea>
      <div className="rideTopRow">
        <div className="arrowHolder">
          <i className="fas fa-arrow-left" onClick={() => clickedReturn()}></i>
        </div>
        <div className="rideTopRowText" onClick={() => clickedReturn()}>
          {" "}
          {`${props.originField ? props.originField : "Kaikkialta"} - ${
            props.destinationField ? props.destinationField : "Kaikkialle"
          } `}
        </div>
      </div>
      {searchLoading ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ minHeight: "35vh" }}></div>
          <Spinner
            animation="border"
            role="status"
            variant="light"
            style={{ width: "10rem", height: "10rem" }}
          >
            {allRides}
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="component-background-ride-view">
          {isEmpty(allRides) ? (
            <NoResults>Haullasi ei löytynyt tuloksia.</NoResults>
          ) : (
            allRides
          )}
          <NoRideFound />
        </div>
      )}
    </ResultArea>
  );
}

const NoResults = styled.div`
  font-size: 3vh;
`;

const ResultArea = styled.div`
  font-size: 2vh;

  .rideTopRow {
    padding: 0.5rem;
    display: flex;
    align-items: center;
  }

  .fas fa-arrow-left {
    display: flex;
    align-items: flex-start;
    font-size: 2.6em;
  }

  .rideTopRowText {
    display: flex;
    align-items: center;
    color: #fff;
    margin-left: 80px;
    font-size: 1.8em;
  }

  .externalText {
    font-size: 0.8rem;
    color: #33aec9;
    text-align: center;
    margin: 0;
  }

  .externalText2 {
    font-size: 0.8rem;
    color: #33aec9;
    text-align: center;
    margin-bottom: 1rem;
  }
`;
