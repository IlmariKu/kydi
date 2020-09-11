import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styled from "styled-components";

export function SubOrigin(props) {
  return (
    <div>
      <div style={{ fontSize: "4vh" }}>{``}</div>
      <Form>
        <Form.Group controlId="suborigin">
          <Form.Control
            style={{ textAlign: "center" }}
            placeholder={"Keskusta, Hervanta"}
            onChange={(event) => props.setSubOrigin(event.target.value)}
          />
        </Form.Group>
        <Explanation>
          Kaupunginosa tai esim. keskusta
        </Explanation>
      </Form>
    </div>
  );
}

const Explanation = styled.div`
  font-size: 3vh;
`;
