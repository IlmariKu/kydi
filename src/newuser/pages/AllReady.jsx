import React from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { Link } from "wouter";

export function AllReady(props) {
  return (
    <div>
      <div style={{ marginBottom: "4vh", fontSize: "3vh" }}>
        {" "}
        Olet valmis! Jos haluat muokata antamiasi tietoja,
        voit katsoa ja muokata tietojasi <Link style={{"color": "blue"}} href="/profiili">Profiili-sivulta</Link>
      </div>
    </div>
  );
}
