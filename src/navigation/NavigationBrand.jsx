import React from "react";
import { Link, useLocation } from "wouter";
import styled from "styled-components";

export const NavigationBrand = () => {
  return (
    <BrandStyling>
      <Link href="/">
        <h1 className="brand-name"> Kydi. </h1>
      </Link>
    </BrandStyling>
  );
};

const BrandStyling = styled.div`
  display: flex;
  justify-self: start;
  cursor: pointer;

  .brand-name {
    color: #fff;
    font-family: "Krona One", sans-serif;
    font-size: 4em;
  }

  .brand-name:hover {
    color: #fafafa;
  }

  a {
    border: none;
    color: #fff;
  }

  a:hover {
    text-decoration: none;
  }

  @media (min-width: 576px) {
    .brand-name {
      font-size: 5.5em;
    }
  }

  @media (min-width: 992px) {
    .brand-name {
      font-size: 4.5em;
    }
  }
`;
