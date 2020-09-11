import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styled from "styled-components";

export function DestinationCity(props) {
  return (
    <div>
      <div style={{ fontSize: "4vh" }}>{`Määränpää`}</div>
      <Form>
        <Form.Group controlId="origin">
          <Form.Control
            style={{ textAlign: "center" }}
            defaultValue={props.destinationField}
            onChange={(event) => props.setDestinationField(event.target.value)}
          />
        </Form.Group>
        <Explanation>
          Kaupungin tai kunnan nimi.
        </Explanation>
      </Form>
    </div>
  );
}

const Explanation = styled.div`
  font-size: 3vh;
`;
