import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "wouter";

export function Footer(props) {
  const [wouter_location, setLocation] = useLocation();

  function footerClick(destination) {
    ga("send", "event", "footer", destination);
    setLocation("/" + destination);
  }

  return (
    <FooterStyling>
      <footer>
        <div className="main-content">
          <div className="left box">
            <h2> Kydi </h2>
            <div className="content">
              <p> 💜 </p>
              <div className="social">
                <span className="fab fa-facebook-f"> </span>
              </div>
            </div>
          </div>

          <div className="center box">
            <h2> Linkit </h2>
            <div className="content">
              <ul>
                <div>
                  <a onClick={() => footerClick("about")}>Kydistä</a>
                </div>
                <div>
                  <a onClick={() => footerClick("uutiset")}>Uutiset</a>
                </div>
                <div>
                  <a onClick={() => footerClick("palaute")}>Anna palautetta</a>
                </div>
                <div>
                  <a onClick={() => footerClick("tietosuojaseloste")}>
                    Tietosuojaseloste
                  </a>
                </div>
                <a onClick={() => footerClick("uutiset")}>Uutiset</a>
              </ul>
            </div>
          </div>
          <div className="right box">
            <h2> Ota yhteyttä </h2>
            <div className="content">
              <p>
                {" "}
                <a mailto="info@kydi.fi">info@kydi.fi </a>{" "}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </FooterStyling>
  );
}

const FooterStyling = styled.div`

footer {
  bottom: 0px;
  width: 100%;
  min-height: 50vh;
  margin-top: 4rem;
  background-color: #007e98;
  color: #fff;
  clip-path: polygon(0 0, 100% 8%, 100% 100%, 0% 100%);

}

.main-content {
  display: flex;
  padding: 2.5rem;

}

.main-content .box {
  flex-basis: 50%;
  padding: 10px 20px;

}

.box h2 {
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: uppercase;
}

.box .content {
  margin: 20px 0 0 0;

}

ul {
  list-style: none;
  padding: 0;
}

a {
  color: #fff;
}

a:hover {
  color: #33aec9;
  cursor: pointer;
}
@media screen and (max-width: 600px) {
  footer{
    bottom: 0px;
  }
  .main-content{
    flex-wrap: wrap;
    flex-direction: column;
  }
  .main-content .box{
    margin: 5px 0;
  }

.
`;
