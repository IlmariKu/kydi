import React from "react";
import Form from "react-bootstrap/Form";

export function FirstName(props) {

  return (
    <div>
      <Form.Group controlId="origin">
        <Form.Control
          style={{ fontSize: "3vh", textAlign: "center" }}
          value={props.firstName}
          onChange={(event) => props.setFirstName(event.target.value)}
        />
      </Form.Group>
      <div style={{ fontSize: "2vh" }}>
        Muut käyttäjät näkevät sinut palvelussa etunimelläsi. Nimimerkit tai
        lempinimet eivät ole sallittuja.
      </div>
    </div>
  );
}
