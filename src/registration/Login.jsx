import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Auth from "@aws-amplify/auth";
import styled from "styled-components";
import queryString from "query-string";

const FB_LOGIN_URL = "https://kydiusers-domain-dev-kydi-auth.auth.eu-central-1.amazoncognito.com/login?response_type=code&client_id=4op2il2nkeommbbe18a04cq74u&redirect_uri=https://kydi.fi/"

export function Login(props) {
  const [loginError, setLoginError] = useState(null);
  const [wouterlocation, setLocation] = useLocation();
  const [loginReason, setLoginReason] = useState(null);

  async function signIn() {
    try {
      event.preventDefault();
      const username = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const info = await Auth.signIn(username, password);
      props.fetchUserInfo(info)
      const redirect_route = sessionStorage.getItem("redirect_route")
      const custom_redirect = customRedirectUrlPassed()
      if (custom_redirect){
        setLocation(`${custom_redirect}&login=success`)
      } else if (redirect_route){
        sessionStorage.removeItem("redirect_route")
        setLocation(`${redirect_route}?login=success`)
      } else {
        setLocation("/?login=success")
      }
    } catch (error) {
      console.error("error", error);
      const errorCode = error?.code;
      const errorMessage = error?.message;
      ga("send", "event", "login", "error", errorCode, errorMessage);
      if (error?.code === "NotAuthorizedException") {
        setLoginError("Käyttäjätunnus tai salasana on väärin");
      } else if (error?.code === "UserNotFoundException") {
        setLoginError("Tunnusta ei löydy");
      } else if (error?.code === "UserNotConfirmedException") {
          setLoginError("Sähköpostiasi ei ole vahvistettu!");
      } else {
        setLoginError(error?.code);
      }
    }
  }

  function customRedirectUrlPassed(){
    const parsed = queryString.parse(location.search);
    if ("ride" in parsed){ 
      return `/kyyti/?id=${parsed.ride}`
    } else if ("user" in parsed){
      return `/profiili/?id${parsed.user}`
    }
  }

  useEffect(() => {
    const reason = queryString.parse(location.search)?.r;
    if (reason === "na"){ // na does not mean anything. It's just short to use to signal ShowText
      setLoginReason("Sinun täytyy kirjautua sisään jatkaaksesi")
    }
  }, []);

  return (
    <FormStyles>
      <Form>
        <div className="wrapper">
          {loginReason ? (
            <YouNeedToLogin>
              Sinun täytyy kirjautua sisään jatkaaksesi
            </YouNeedToLogin>
          ) : null}
          <section className="background">
            <div className="col text-center">
              {" "}
              <h3 className="login-text font-weight-bold">
                {" "}
                Kirjaudu sisään 🗝️{" "}
              </h3>{" "}
            </div>
            <a style={{"fontSize": "3vh"}} href={FB_LOGIN_URL}>

            <RegisterWithFacebookBox>
                <RegisterWithFacebookButton>
                  <div className="fb-items">
                <i className="fab fa-facebook"></i>
                <span className="fb-text">  Kirjaudu Facebookilla </span>
                </div>
                </RegisterWithFacebookButton>
              </RegisterWithFacebookBox>

            </a>
            <Form.Group name="username" controlId="email">
              <Form.Label>Sähköposti</Form.Label>
              <Form.Control size="md" type="email" style={{ fontSize: "3vh" }} />
            </Form.Group>

            <Form.Group name="password" controlId="password">
              <Form.Label>Salasana</Form.Label>
              <Form.Control size="md" type="password" style={{ fontSize: "3vh" }} />
            </Form.Group>

            <div className="col text-center">
              <Button
                size="lg"
                onClick={() => signIn()}
                type="submit"
                className={"btn-login"}
                block
              >
                Kirjaudu <i className="fas fa-arrow-right"></i>
              </Button>
              <LoginError>{loginError}</LoginError>
              <RegisterHere>
            Ei tunnusta?
            <div className="registerHere">  <Link href="/rekisteroidy">Rekisteröidy tästä!</Link> </div>
          </RegisterHere>
            </div>
          </section>

        </div>
      </Form>
    </FormStyles>
  );
}

const RegisterHere = styled.div`
  font-size: 2.5vh;

  .registerHere {
    color: #007e98;
  }
`;

const YouNeedToLogin = styled.div`
  font-size: 2vh;
  color: blue;
`;

const LoginError = styled.div`
  font-size: 3vh;
  color: red;
`;

const RegisterWithFacebookBox = styled.div`
display: flex;
  align-items: center;
  font-size: 3vh;
  justify-content: center;
  font-family: Montserrat;
  width: 100%;
`;

const RegisterWithFacebookButton = styled.div`
  background-color: #385898;
  border-radius: 0.4em;
  display: inline-flex;
  flex-direction: column;
  padding: 1rem;
  font-size: 1rem;
  color: #fff;
  margin: 2rem 0rem 2rem 0rem;
  .fb-items {
    flex-direction: column;
  }
`;


const FormStyles = styled.section`
  .background {
    background-color: #f5ffff;
    padding: 20px;
    border-radius: 1.5em;
    -webkit-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    -moz-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
  }
  login-text {
    font-size: 2em;
    color: #77009a;
    margin-bottom: 1em;
  }

  .form-label {
    font-size: 1.5em;
  }

  @media (min-width: 576px) {
    .login-text {
      font-size: 4em;
    }
    .form-label {
      font-size: 2.5em;
    }
  }

  @media (min-width: 992px) {
    .login-text {
      font-size: 2em;
    }
    .form-label {
      font-size: 1.5em;
    }

    .wrapper {
      padding: 1.5rem 2rem 0 2rem;
    }
  }

  .form-control {
    height: calc(2.5em + 1rem + 4px);
    background-color: #f5ffff;
    border: none;
    border-bottom: 1px solid #71e0fc;
  }
  .form-control:focus {
    background-color: #fafafa;
    color: #333535;
  }
`;
