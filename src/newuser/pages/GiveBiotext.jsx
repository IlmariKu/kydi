import React from "react";
import { Form } from "react-bootstrap";
import { biotext_placeholder } from "../../helpers/texts";

export function GiveBiotext(props) {

  return (
    <div>
      <Form.Group controlId="origin">
        <Form.Control
          as="textarea"
          rows="10"
          placeholder={biotext_placeholder}
          style={{ fontSize: "2vh", textAlign: "center" }}
          value={props.firstName}
          onChange={(event) => props.setBiotext(event.target.value)}
        />
      </Form.Group>
    </div>
  );
}
