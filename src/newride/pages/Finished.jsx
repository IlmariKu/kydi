import React from "react";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { useLocation } from "wouter";

export function Finished(props) {
  const [location, setLocation] = useLocation();

  const facebookShareButton = (
    <Button
      className="btn-searchform"
      block
      target="_blank"
      href={`https://www.facebook.com/sharer/sharer.php?u=https://kydi.fi/kyyti?id=${props.rideID}`}
    >
      Jaa Facebookissa!
    </Button>
  );

  return (
    <div>
      {facebookShareButton}
        <Button
          className="btn-searchform"
          onClick={() => setLocation("/")}
          block
        >
          Palaa hakunäyttöön
        </Button>
    </div>
  );
}
