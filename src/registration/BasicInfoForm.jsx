import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "wouter";
import styled from "styled-components";

const FB_LOGIN_URL = "https://kydiusers-domain-dev-kydi-auth.auth.eu-central-1.amazoncognito.com/login?response_type=code&client_id=4op2il2nkeommbbe18a04cq74u&redirect_uri=https://kydi.fi/"

export function BasicInfoForm(props) {
  return (
    <RegStyles>
      <Form>
        <div className="wrapper">
          <section className="background">
            <div className="col text-center">
              {" "}
              <h3 className="login-text font-weight-bold">
                {" "}
                Rekisteröidy 👋🏻{" "}
              </h3>{" "}
            </div>
            <a style={{"fontSize": "3vh"}} href={FB_LOGIN_URL}>


              <RegisterWithFacebookBox>
                <RegisterWithFacebookButton>
                  <div className="fb-items">
                <i className="fab fa-facebook"></i>
                <span className="fb-text">  Rekisteröidy Facebookilla </span>
                </div>
                </RegisterWithFacebookButton>
              </RegisterWithFacebookBox>
              </a>

            <ManualRegisterOr>Tai</ManualRegisterOr>
            <Form.Group controlId="email">
              <Form.Control
                disabled={props.isLoading}
                type="email"
                placeholder="Sähköposti"
                style={{ fontSize: "3vh" }}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Control
                disabled={props.isLoading}
                type="password"
                placeholder="Salasana"
                style={{ fontSize: "3vh" }}
              />
            </Form.Group>

            <Form.Group controlId="confirm_password">
              <Form.Control
                disabled={props.isLoading}
                type="password"
                placeholder="Vahvista salasana"
                style={{ fontSize: "3vh" }}
              />
              <Form.Text
                style={{ fontSize: "2vh", marginLeft: "15px", marginBottom: "2rem"}}
                className="text-muted"
              >
                Salasanan on oltava vähintään 6 merkkiä pitkä, sisältäen yhden
                numeron, ison kirjaimen ja erikoismerkin.
              </Form.Text>
            </Form.Group>
            <Row>
              <Col xs={2}>
                <Form.Group
                  className={"checkbox6x"}
                  controlId="formBasicCheckbox"
                >
                  <Form.Check
                    type="checkbox"
                    checked={props.termsAccepted}
                    style={{padding: "0.5rem"}}
                    onChange={(event) =>
                      props.setTermsAccepted(event.target.checked)
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={10}>
                <span style={{ fontSize: "2vh", marginLeft: "1rem"}}>
                  Olen lukenut ja hyväksyn{" "}
                  <a
                    target={"_blank"}
                    href="/tietosuojaseloste"
                    style={{ color: "blue"}}
                  >
                    tietosuojaehdot
                  </a>
                </span>
              </Col>
            </Row>
          </section>
        </div>
      </Form>
    </RegStyles>
  );
}

const RegisterWithFacebookBox = styled.div`
display: flex;
  align-items: center;
  font-size: 3vh;
  justify-content: center;
  font-family: Montserrat;
  margin-bottom: 1vh;
  width: 100%;
`;

const RegisterWithFacebookButton = styled.div`
  background-color: #385898;
  border-radius: 0.4em;
  display: inline-flex;
  flex-direction: column;
  padding: 1rem;
  color: #fff;
  margin: 2rem 0rem 2rem 0rem;


  .fb-items {
    flex-direction: column;
  }
`;

const ManualRegisterOr = styled.div`
  text-align: center;
  font-size: 2vh;
  margin-bottom: 1vh;
`;

const RegStyles = styled.section`
  .background {
    background: #f5ffff;
    padding: 20px;
    border-radius: 1em;
    -webkit-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    -moz-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
  }
  login-text {
    font-size: 2em;
    color: #77009a;
    margin-bottom: 1em;
  }

  @media (min-width: 576px) {
    .login-text {
      font-size: 3em;
      margin-bottom: 1em;
    }
  }

  @media (min-width: 992px) {
    .login-text {
      font-size: 1.5em;
    }

    .wrapper {
      padding: 1.5rem 2rem 0 2rem;
    }
  }

  .form-control {
    height: calc(2em + 1rem + 4px);
    margin-bottom: 0.5em;
    background: none;
    border: none;
    border-radius: 5rem;
    border: 1px solid #71e0fc;
  }
  .form-control:focus {
    background-color: #fafafa;
    color: #333535;
  }

  @media (min-width: 992px) {
    .form-control {
      height: calc(1em + 1rem + 2px);
    }
  }

  .fb-text {
    font-size: 1rem;
  }

 @media (max-width: 700px) {
   .fb-text {
     font-size: 1rem;
   }
 }
`;
