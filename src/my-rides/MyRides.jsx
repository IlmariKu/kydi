import React, { useState, useEffect } from "react";
import { api_get, SEARCH_RIDES_URL } from "../helpers/api.js";
import { Link } from "wouter";
import { convertDateToString } from "../helpers/date.js";
import styled from "styled-components";

const userID = sessionStorage.getItem("userID");

export function MyRides(props) {
  const [rides, setRides] = useState(null);

  async function getRidesWherePartOf() {
    const response = await api_get(`${SEARCH_RIDES_URL}?user-id=${userID}`);
    const rows = response.map(function (ride) {
      return (
        <div key={ride["departure-date"]} style={{ marginBottom: "4vh" }}>
          <div>{`${ride.origin} - ${ride.destination}`}</div>
          <div>
            {`${convertDateToString(
              new Date(ride["departure-date"]),
              false,
              true
            )}`}
          </div>
          <Link
            style={{ color: "#26f8ff" }}
            href={`/kyyti?id=${ride["ride-id"]}`}
          >
            Linkki ilmoitukseen
          </Link>
        </div>
      );
    });
    if (rows) {
      setRides(rows);
    }
  }

  useEffect(() => {
    getRidesWherePartOf();
  }, []);

  return (
    <div className="component-background-ride-view">
      <MyRidesStyling>
        <h4 className="myRidesTitle"> Omat matkat </h4>
        {rides ? (
          rides
        ) : (
          <div className="myRidesContent">
            Omia matkoja ei löytynyt. Ehkäpä sinun pitäisi etsiä lähteä
            sellaiselle
            <Link href="/">
              <a style={{ color: "#008e91", cursor: "pointer" }}>
                {" "}
                käyttämällä hakua?
              </a>
            </Link>
          </div>
        )}

        <h4 className="myRidesTitle">Avoimet keskustelut </h4>

        <div> 0 avointa keskustelua  </div> 
      </MyRidesStyling>
    </div>
  );
}

const MyRidesStyling = styled.div`
  .myRidesTitle, .myRidesContent {
    margin-bottom: 1.5rem;
  }
`;
