import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { convertDateToString } from "../../helpers/date.js";

export function Review(props) {
  return (
    <div style={{ fontSize: "3vh", textAlign: "left" }}>
      <div style={{ fontSize: "2vh"}}>Matkatiedot</div>
      <div>{`${props.originField} (${props.subOrigin}) - ${props.destination}`}</div>

      <div>{`${convertDateToString(
        props.whenLeavingDate
      )} - ${props.whenLeavingTime}`}</div>
      <div style={{ height: "3vh" }}></div>
      <div style={{ fontSize: "2vh"}}>Vapaa teksti</div>
      <div
        style={{ fontFamily: "Montserrat-Italic" }}
      >{`${props.postText}`}</div>
      <div style={{ height: "3vh" }}></div>
      <div>
        <Button
          className={"btn-searchform"}
          block
          onClick={() => props.sendRide(props.requestOrRide)}
        >
          Julkaise! <i className="fas fa-bullhorn"></i>
        </Button>
      </div>
    </div>
  );
}
