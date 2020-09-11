import React, { useState } from "react";
import { useLocation } from "wouter";

export const LaunchNews = () => {
  const [wouter_location, setLocation] = useLocation();

  function clickedBack() {
    setLocation("/uutiset");
    ga("send", "event", "news", "kydipublished");
  }
  return (
    <div className="component-background-ride-view">
      <i className="fas fa-arrow-left" onClick={() => clickedBack()}></i>
      <h4>Kydi on julkaistu 8.8.2020 🚀</h4>
      <p> Uusi kimppakyytisovellus Kydi on julkaistu 8.8.2020!</p>

      <p>
        {" "}
        Kydi syntyi ajatuksesta, että kimppakyydit voi järjestää paremmin. Suomi
        on iso maa, jossa välimatkat ovat pitkät ja matkustaminen - myös omalla
        autolla, usein kallista. Kimppakyydeille on siis tarvetta! Miksi
        matkustaa yksin, kun matkan ja bensakulut voi jakaa toisen kanssa?
      </p>

      <p>
        {" "}
        Kydin ajatuksena on tehdä tästä kaikesta helpompaa. Olemme tehneet
        sovelluksen, jonka avulla voit sekä hakea- että ilmoittaa kimppakyytejä.
        Tarkoituksenamme on ollut rakentaa alusta, joka tekee kyytien
        ilmoittamisesta, hakemisesta ja sopimisesta helpompaa 😊
      </p>

      <p>
        Kydi on vasta julkaistu, ja kehitämme sovellusta ja sen ominaisuuksia
        jatkuvasti. Kuulemme mielellämme palautetta sovelluksesta ja olemme
        avoimia kehitysehdotuksille 💜
      </p>

      <p style={{alignItems: "center"}}>
        {" "}
        <b> Kydi - löydä seuraava jaettu matkasi </b>{" "}
      </p>

      <p style={{alignItems: "center"}}>
        <a href="/">Hae kimppakyytejä!</a>{" "}
      </p>
    </div>
  );
};
