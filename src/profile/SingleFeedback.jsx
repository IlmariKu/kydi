import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import { SVGStar } from "../../static/icons/SVGStar.js";

const MOCK_IMAGE_URL =
  "https://qodebrisbane.com/wp-content/uploads/2019/07/This-is-not-a-person-2-1.jpeg";

export function SingleFeedback(props) {
  return (
    <div>
      <Row>
        <Col xs={2}>
          <div style={{ height: "6vh", width: "6vh" }}>
            <img
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
              }}
              src={MOCK_IMAGE_URL}
            />
          </div>
        </Col>
        <Col xs={10}>
          <Row>
            <div style={{ fontSize: "2vh" }}>Jemina, 2kk sitten</div>
          </Row>
          <Row>
            <div style={{ marginTop: "-1vh" }}>
              <SVGStar starcount={parseInt(props.stars)} />
            </div>
          </Row>
        </Col>
      </Row>
      <TextFeedback>{props.text}</TextFeedback>
    </div>
  );
}

const TextFeedback = styled.div`
  font-size: 2vh;
`;
