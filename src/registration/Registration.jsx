import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { BasicInfoForm } from "./BasicInfoForm.jsx";
import { OnlyEmailForm } from "./OnlyEmailForm.jsx";
import { useLocation } from "wouter";
import _ from "lodash";
import Auth from "@aws-amplify/auth";
import styled from "styled-components";
import { api_post, SLACK_WEBHOOK } from "../helpers/api";


export function Registration(props) {
  const [isLoading, setLoading] = useState(false);
  const [registerComplete, setRegisterComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useLocation("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  function postToSlack() {
    const feedbackText = "Rekisteröityi ilmoitusta varten, kun äppi on valmis";
    ga("send", "event", "register", "forEmailWhenReady");
    const email = document.getElementById("email").value;
    const data = {
      text: `${feedbackText} \n\n Sähköposti: ${email} `,
    };
    api_post(SLACK_WEBHOOK, data, true);
    setRegisterComplete(true);
  }

  function makeSurePasswordsMatch() {
    return (
      document.getElementById("password").value ===
      document.getElementById("confirm_password").value
    );
  }

  const translations = {
    username: "Sähköposti", // Cognito username is email
    password: "Salasana",
  };

  function fieldsNotEmpty(user) {
    let error_msg = "";
    Object.keys(user).forEach(function (user_field) {
      if (_.isEmpty(user[user_field])) {
        error_msg += `${translations[user_field]} on tyhjä. `;
      }
    });
    return error_msg;
  }

  function getPasswordError(message) {
    if (message.includes("must have uppercase")) {
      return "Salasanan täytyy sisältää vähintään yksi iso kirjain";
    } else if (message.includes("must have length greater")) {
      return "Salasana on liian lyhyt. Minimipituus on 6 merkkiä.";
    } else if (message.includes("must have numeric characters")) {
      return "Salasanan täytyy sisältää ainakin yksi numero.";
    } else if (message.includes("must have symbol characters")) {
      return "Salasanan täytyy sisältää yksi erikoismerkki (kuten jokin näistä !@£$∞<).";
    } else {
      message;
    }
  }

  async function signUp() {
    setLoading(true);
    try {
      event.preventDefault();

      if (!makeSurePasswordsMatch()) {
        setErrorMessage("Salasanat eivät täsmää.");
        ga("send", "event", "register", "passwordNotMatch");
        setLoading(false);
        return;
      }
      const newUser = {};
      newUser.username = document.getElementById("email").value;
      newUser.password = document.getElementById("password").value;

      const fieldErrors = fieldsNotEmpty(newUser);
      if (fieldErrors) {
        setErrorMessage(fieldErrors);
        ga("send", "event", "register", "fieldsEmpty");
        setLoading(false);
        return;
      }

      const user = await Auth.signUp(newUser);
      if ("user" in user) {
        setLoading(false);
        ga("send", "event", "register", "completed");
        setRegisterComplete(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("error signing up", error);
      setLoading(false);
      const errorCode = error?.code;
      const errorMessage = error?.message;
      ga("send", "event", "register", "error", errorCode, errorMessage);
      if (
        errorCode == "UserNameExistsException" ||
        errorCode == "UsernameExistsException"
      ) {
        setErrorMessage("Käyttäjä tällä sähköpostilla on jo olemassa.");
      } else if (
        errorCode == "InvalidParameterException" ||
        errorCode == "InvalidPasswordException"
      ) {
        setErrorMessage(getPasswordError(error.message));
      } else {
        setErrorMessage(`${error.code}: ${error.message}`);
      }
    }
  }

  const registerSuccess = (
    <div>
      <div>Rekisteröityminen onnistui!</div>
      <div style={{ height: "3vh" }}></div>
      <div style={{ fontSize: "3vh" }}>
        Sinun pitää kuitenkin vielä vahvistaa sähköpostisi ennenkuin voit
        kirjautua sisään.
        <div style={{ height: "3vh" }}></div>
        <p>Avaa sähköpostisi.</p>
        <p>Klikkaa sinulle kydi.fi-osoitteesta tullutta linkkiä.</p>
        <p>Ja olet valmis hyppäämään kyytiin!</p>
      </div>
    </div>
  );

  return (
    <FormStyles>
      <div>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        {registerComplete ? (
          <div>
            <div style={{ fontSize: "4vh", textAlign: "center" }}>
                {registerSuccess}
            </div>
            <Button
              className={"btn-login"}
              onClick={() => setLocation("/")}
              type="submit"
              block
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              Palaa takaisin hakuun
            </Button>
          </div>
        ) : (
          <div>
              <BasicInfoForm
                setTermsAccepted={setTermsAccepted}
                termsAccepted={termsAccepted}
                isLoading={isLoading}
              />
            <div style={{ height: "2vh" }}></div>
            <Button
              className={"btn-login"}
              onClick={() => {signUp()}}
              disabled={termsAccepted === false}
              type="submit"
              block
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              {"Rekisteröidy!"}
            </Button>
          </div>
        )}
      </div>
    </FormStyles>
  );
}

const ErrorMessage = styled.div`
  color: red;
  font-size: 4vh;
`;

const FormStyles = styled.section`
  .btn-login {
    background: radial-gradient(
      circle,
      rgba(0, 129, 152, 0.8169642857142857) 0%,
      rgba(0, 129, 152, 1) 100%
    );
    padding: 1em;
    border: none;
  }

  .btn-login:hover {
    background-color: #009ca1;
    transform: scale(1.01);
    border: none;
  }
`;
