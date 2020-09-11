import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styled from "styled-components";

export function OriginCity(props) {
  return (
    <div>
      <Form>
        <Form.Group controlId="from_where">
          <Form.Control
            size="lg"
            style={{ textAlign: "center" }}
            defaultValue={props.originField}
            onChange={(event) => props.setOriginField(event.target.value)}
          />
        </Form.Group>
        <Explanation>Kaupungin, kunnan tai muun lähtöpaikan nimi.</Explanation>
      </Form>
    </div>
  );
}

const Explanation = styled.div`
  font-size: 3vh;
`;
