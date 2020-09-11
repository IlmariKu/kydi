import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export function NewPostText(props) {
  return (
    <div>
      <Form>
        <Form.Group controlId="origin">
          <Form.Control
            rows="10"
            as="textarea"
            style={{ fontSize: "2vh" }}
            placeholder={
              props.requestOrRide === "request"
                ? "Paljon matkatavaroita? Voit ajaa osan matkasta? Kerro mitä haluaisit kanssamatkustajasi tietävän matkastasi."
                : "Käytössäsi on pakettiauto? Oletko allerginen kissoille? Kerro mitä haluaisit kanssamatkustajasi tietävän matkastasi. \n\nJos aiot kysyä bensarahaa, kirjoita siitäkin tähän 💰. Käteinen, Mobilepay?"
            }
            onChange={(event) => props.setPostText(event.target.value)}
            value={props.postText}
          />
        </Form.Group>
      </Form>
    </div>
  );
}
