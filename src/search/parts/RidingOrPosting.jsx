import React, { useState } from "react";
import styled from "styled-components";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

export function RidingOrPosting(props) {

  function clickedItem(k){
    ga('send', 'event', 'lookingPostingSelected', k)
    props.setLookingOrPosting(k)
  }

  return (
    <Styles>
      <Tabs
        id="controlled-tab-example"
        activeKey={props.lookingOrPosting}
        onSelect={(k) => clickedItem(k)}
      >
        <Tab eventKey="isLooking" title="Etsin kyytiä"></Tab>
        <Tab eventKey="isPosting" title="Ilmoitan kyydin"></Tab>
      </Tabs>
      </Styles>
  );
}

const Styles = styled.section`
  .nav {
    margin-bottom: 1.5em;
    border-color: #009995;
    font-size: 1em;
  }
  @media (min-width: 326px) {
    .nav {
      font-size: 1.2em;
      margin-bottom: 1em;
    }

    .nav-tabs .nav-link.active {
      background-color: #007e98;
      color: #fff;
      border: none;
    }
   }

  @media (min-width: 576px) {
    .nav {
      font-size: 2em;
      margin-bottom: 1em;
    }

    .nav-tabs .nav-link.active {
      background-color: #007e98;
      color: #fff;
      border: none;
    }
   }

   @media (min-width: 992px) {
    .nav {
      font-size: 1.4em;
      margin-bottom: 1em;
   }

  .nav-tabs .nav-link.active {
    background-color: #007e98;
    color: #fff;
    border: none;
  }
  a {
    color: #212529;
  }
`;
