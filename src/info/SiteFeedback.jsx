import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { api_post, SLACK_WEBHOOK } from "../helpers/api.js";

export function SiteFeedback(props) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [location, setLocation] = useLocation();

  function postToSlack() {
    const feedbackText = document.getElementById("feedback_text").value;
    const feedbackEmail = document.getElementById("feedback_email").value;
    const data = {
      text: `${feedbackText} \n\n Sähköposti: ${feedbackEmail} `,
    };
    api_post(SLACK_WEBHOOK, data, true);
    setFeedbackGiven(true);
  }

  return (
    <FeedbackArea>
      <div className="component-background-ride-view">
      {feedbackGiven ? (
        <div>
          <ThankYouText>Kiitos palautteesta!</ThankYouText>
          <p style={{ textAlign: "center" }}>
            Äppi on vielä ihan alkuvaiheissaan ja arvostamme kovasti kaikkea
            palautetta!
          </p>
          <Button block onClick={() => setLocation("/")}>
            Palaa hakusivulle
          </Button>
        </div>
      ) : (
        <Form>
          <Form.Group controlId="feedback_text">
            <Form.Label>Mitä pidit Kydistä? 🙂</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              style={{"fontSize": "2vh"}}
              placeholder="Kirjoita ihan mitä tahansa jota mieleesi tulee. Haluaisimme kuulla ihan kaikkea mahdollista."
            />
          </Form.Group>

          <Form.Group controlId="feedback_email">
            <Form.Label>Sähköposti</Form.Label>
            <Form.Control placeholder="(ei pakollinen)" style={{"fontSize": "4vh"}} />
          </Form.Group>
          <Button
            className={"btn-searchform"}
            block
            onClick={() => postToSlack()}
          >
            Lähetä palaute
          </Button>
        </Form>
      )}
      </div>
    </FeedbackArea>
  );
}

const ThankYouText = styled.div`
  text-align: center;
  font-size: 4vh;
`;

const FeedbackArea = styled.div`
 text-align: center;
  width: 92%;
  margin-left: 4%;
`;
