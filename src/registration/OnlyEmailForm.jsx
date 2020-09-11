import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import styled from "styled-components";



export function OnlyEmailForm(props) {

  // Käyttäjä voi jättää meilin jos hän haluaa tietää, koska tuote julkaistaan

  return (
    <RegStyles>
    <Form>
    <div className="wrapper">
      <section className="background">

      <div className="col text-center">
         {" "}
         <h3 className="login-text font-weight-bold">
         {" "}
         Jätä sähköpostisi! 👋🏻 Saat tiedon, kun äppi julkaistaan{" "}
         </h3>{" "}
      </div>

      <Form.Group controlId="email">
        <Form.Control type="early_email" placeholder="Sähköposti" />
      </Form.Group>
      </section>
      </div>
    </Form>
    </RegStyles>
  );
}


const RegStyles = styled.section`
  .background {
    background: #f5ffff;
    padding: 20px;
    border-radius: 1.5em;
    -webkit-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    -moz-box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
    box-shadow: -2px 2px 25px 8px rgba(87, 87, 87, 0.2);
  }
    login-text {
    font-size: 2em;
    color: #77009a;
    margin-bottom: 2em;
  }



  @media (min-width: 576px) {
    .login-text {
      font-size: 3em;
      margin-bottom: 2em;
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
    margin-bottom: .5em;
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
    }}


`;
