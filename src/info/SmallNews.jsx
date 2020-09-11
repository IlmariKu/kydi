import React from "react";
import styled from "styled-components";

export function SmallNews() {

  return (
    <div className="component-background-ride-view">
      <h4> Uutiset </h4>
      <NewsStyling>
        <div className="singleResultBox">
          <h5> Kydi on julkaistu 8.8.2020 🚀</h5>
          <p>
            Uusi kimppakyytisovellus Kydi on julkaistu, tutustu sovellukseen.{" "}
          </p>
          <a href="/launchNews">
            {" "}
            <i className="fas fa-plus"></i> Lue lisää....
          </a>
        </div>
      </NewsStyling>
    </div>
  );
}

const NewsStyling = styled.div`
  .singleResultBox {
    background-color: #fff;
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 1rem;
    -webkit-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    -moz-box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    box-shadow: 2px 3px 7px -2px rgba(168, 166, 168, 0.62);
    min-height: 7vh;
    padding: 1rem 1.3rem 0.6rem 1rem;
  }

  h4 {
    text-align: center;
  }
`;
