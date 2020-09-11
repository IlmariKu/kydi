import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useLocation } from "wouter";
import styled from "styled-components";
import { ResultBox } from "./SingleResult.jsx";
import { SVGPlus } from "../../static/icons/SVGPlus.js";

export function NoRideFound(props) {
  const [location, setLocation] = useLocation();

  function clickLeaveRideRequest() {
    ga("send", "event", "resultView", "rideNotFoundClicked");
    setLocation("/pyynto");
  }

  return (
    <LeaveRideRequest> 
  
     
     <h4 className="request-text" onClick={() => clickLeaveRideRequest()}> Jätä kyytipyyntö  </h4>
     <div className="requestPlus" onClick={() => clickLeaveRideRequest()}> 
     <i className="fas fa-plus-circle">  </i>
        </div> 
      
        
    </LeaveRideRequest>
  );
}

const LeaveRideRequest = styled.div`
min-height: 3rem; 
background: radial-gradient(
  circle,
  rgba(0, 129, 152, 0.8169642857142857) 0%,
  rgba(0, 129, 152, 1) 100%
);
color: #fff; 
display: flex; 
margin-top: 1.1rem; 
border-radius: 1rem; 
padding: 1rem; 
justify-content: space-between; 
align-items: center; 
position: sticky; 

.fa-plus-circle {
  font-size: 2.5em; 
  cursor: pointer; 
}

@media (min-width: 576px) {
  .request-text {
    font-size: 1.5em;
  }
}

`; 