import React from "react";
import styled from "styled-components";
import { useLocation } from "wouter";

AOS.init({
  duration: 850,
  mirror: false,
});

export function MainPageContent() {
  const [wlocation, setLocation] = useLocation();

  function clickedSublink(link){
    ga("send", "event", "mainpagenews", "clicked", link);
    setLocation("/" + link)
  }

  return (
    <>
      <div
        className="component-background-mainpage-view"
        data-aos="zoom-in-up"
        data-aos-mirror="false"
      >
        <h4 className="mainPageTitle"> Löydä seuraava jaettu matkasi! </h4>

        <p>
          {" "}
          Kydi on uusi sovellus, jonka avulla löydät tai ilmoitat kimppakyydin
          määränpäähäsi. Etsi muita samaan paikkaan matkustavia jakamaan
          bensakulusi ja tutustumaan toiseen ihmiseen samalla, kun matkustat
          määränpäähäsi. Hae ylhäältä kyytejä, <LinkText onClick={() => clickedSublink("about")}>
            {" "}
            lue tarina Kydin takaa
          </LinkText>{" "}
          tai <LinkText onClick={() => clickedSublink("rekisteroidy")}>hyppää suoraan mukaan rekisteröitymällä!</LinkText>
        </p>
      </div>

      <div
        className="component-background-main-news"
        data-aos="zoom-in-up"
        data-aos-mirror="false"
      >
        <h5> Kydi on julkaistu 8.8.2020 🚀</h5>
        <p>
          Uusi kimppakyytisovellus Kydi on julkaistu, tutustu sovellukseen.{" "}
        </p>
        <a href="/launchNews">
          {" "}
          <i className="fas fa-plus"></i> Lue lisää....
        </a>
      </div>
    </>
  );
};

const LinkText = styled.span`
  font-weight: bold;
  color: #26f8ff;
  cursor: pointer;
`;
