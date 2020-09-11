import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import styled from "styled-components";

export function PrivacyPolicy(props) {
  const [loginError, setLoginError] = useState(null);
  const [location, setLocation] = useLocation();

  const rekisterinpitaja = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>1. Rekisterinpitäjä</h1>
      <p>Ilmari Kumpula, 3137517-1</p>
      <p>Vedenottamontie 8 A 6</p>
      <p>info@kydi.fi</p>
      <p>www.kydi.fi</p>
    </div>
  );

  const rekisterinnimi = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>2. Rekisterin tarkoitus ja nimi</h1>
      <p>Yrityksen asiakasrekisteri</p>
    </div>
  );

  const henkilotietojen_kasittely = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>
        3. Henkilötietojen käsittelyn tarkoitus ja käsittelyn oikeusperuste
      </h1>
      <p>
        EU:n yleisen tietosuoja-asetuksen mukainen oikeusperuste henkilötietojen
        käsittelylle on henkilön vapaaehtoinen suostumus ja rekisterinpitäjä
        oikeutettu etu perustuen asiakassuhteeseen.
      </p>
      <p>Henkilötietojen käsittelyn tarkoitus on yhteydenpito asiakkaisiin.</p>
    </div>
  );

  const rekisterin_tietosisalto = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>4. Rekisterin tietosisältö</h1>
      <p>Rekisteriin tallennattava tietoja ovat:</p>
      <p>Yhteystiedot, nimi, sähköpostiosoite ja puhelinnumero:</p>
      <p>
        Sosiaalisen median tunnukset/profiilit, jotka on vapaaehtoisesti
        luovutettu
      </p>
      <p>
        Tietoja säilytetään kunnes asiakas pyytää tietonsa poistettavaksi tai
        palvelu muuten lakkautetaan.
      </p>
    </div>
  );

  const henkilotietojen_vastaanottajat = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>5. Henkilötietojen vastaanottajat tai vastaanottajaryhmät</h1>
      <p>
        {" "}
        Tietojen käsittelyssä voidaan käyttääkolmansien osapuolten palveluja
        esimerkiksi tietotekniikan palveluiden osalta jolloin varmistetaan
        tietojen lainmukaisen käsittely sopimusjärjestelyin sekä ohjeistamalla
        kolmansia osapuolia tietojen käsittelystä. Kolmannet osapuolet voivat
        vaihdella.{" "}
      </p>
    </div>
  );

  const henkilotietojen_siirto_kolmanteen_maahan = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>6. Henkilötietojen siirto toiseen maahan</h1>
      <p>
        Osa rekisterinpitäjän käyttämistä henkilötietojen käsittelyyn
        liittyvistä palveluista voi toimia Euroopan unionin jäsenvaltioiden
        alueen tai Euroopan talousalueen ulkopuolella. Tietojen siirrossa
        noudatetaan tällöin tietosuojalainsäädännön vaatimuksia ja käytetään
        esimerkiksi Euroopan komission mallisopimuslausekkeita sovittaessa
        tietojen siirrosta henkilötietojen käsittelijätahon kanssa.
      </p>
    </div>
  );

  const rekisteroityjen_oikeudet_tarkastaa_tiedot = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>7. Rekisteröidyn oikeus tarkastaa tiedot</h1>
      <p>
        Rekisteröidyllä on oikeus tarkastaa, mitä häntä koskevia tietoja
        henkilörekisteriin on tallennettu ja saada kopio näistä tiedoista.
        Rekisteröidyn pitää lähettää tarkastuspyyntö osoitteeseen info@kydi.fi.
        Rekisteröidyn tulee esittää tarkastuspyynnössä tiedon etsimiseen
        tarpeelliset tiedot. Tarvittaessa rekisterinpitäjä kysyy lisätietoja
        rekisteröidyn tunnistamiseksi. Tarkastuspyynnön vastaus lähetetään
        tarkastuspyynnön pyytäjälle sähköpostitse, jollei rekisteröity pyydä
        lähettämään tietoja muulla tavoin.
      </p>
    </div>
  );

  const rekisteroityjen_oikeudet_korjata = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>8. Rekisteröidyn oikeus tiedon korjaamiseen</h1>
      <p>
        Huolehdimme omien mahdollisuuksiemme mukaan käsittelemiemme
        henkilötietojen laadusta. Oikaisemme, poistamme tai täydennämme
        virheellisen tai tarpeettoman henkilötiedon oma-aloitteisesti tai
        rekisteröidyn vaatimuksesta.
      </p>
    </div>
  );

  const rekisteroityjen_oikeudet_rajoittamiseen = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>9. Rekisteröidyn oikeus käsittelyn rajoittamiseen</h1>
      <p>
        Rekisteröidyllä on oikeus siihen, että pyytää Kydi.fi rajoittamaan
        käsittelyä, jos rekisteröity esimerkiksi kiistää henkilötietojen
        paikkansapitävyyden. Tällöin käsittelyä rajoitetaan kunnes
        rekisterinpitäjä voi varmistaa niiden paikkansapitävyyden.
      </p>
    </div>
  );

  const rekisteroityjen_oikeudet_poistamiseen = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>
        10. Rekisteröidyn oikeus vaatia tietojen poistamista tai käsittelyä
      </h1>
      <p>
        Rekisteröidyllä on oikeus vaatia henkilötietojensa poistamista tai
        vastustaa niiden käsittelyä silloin kun se perustuu oikeutettuun etuun.
        Rekisteröidyllä on oikeus vastustaa suoramarkkinointia ottamalla yhteys
        osoitteeseen info@kydi.fi.
      </p>
    </div>
  );

  const rekisteroityjen_oikeudet_valitukseen = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>11. Rekisteröidyn oikeus tehdä valitus valvontaviranomaiselle</h1>
      <p>
        Rekisteröity voi tehdä henkilötietojen käsittelystä valituksen
        valvovalle viranomaiselle, joka on tietosuojavaltuutettu.
      </p>
    </div>
  );

  const evasteet = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>11. Evästeet</h1>
      <p>
        Verkkosivustolla käytetään evästeitä ja kävijästä tallennetaan nimetöntä
        web-analytiikkaa parantamaan palvelun käyttökokemusta.
      </p>
    </div>
  );

  const muutokset_tietosuojaan = (
    <div>
      <div style={{ height: "3vh" }}></div>
      <h1>12. Muutokset tietosuojakäytäntöön</h1>
      <p>
        Tähän tietosuojaselosteeseen ja siihen liittyviin tietoihin voidaan
        tehdä muutoksia. On suositeltavaa, että rekisteröidyt käyvät katsomassa
        tätä tietosuojakäytäntöä säännöllisesti saadakseen tiedon siihen
        mahdollisesti tehdyistä muutoksista.
      </p>
    </div>
  );

  return (

    <PageStyles>
      <div className="component-background-ride-view">
      <div style={{ fontSize: "5vh" }}>Tietosuojaseloste</div>
      <p>Viimeksi muokattu: 19. Heinäkuuta, 2020</p>
      {rekisterinpitaja}
      {rekisterinnimi}
      {henkilotietojen_kasittely}
      {rekisterin_tietosisalto}
      {henkilotietojen_vastaanottajat}
      {henkilotietojen_siirto_kolmanteen_maahan}
      {rekisteroityjen_oikeudet_tarkastaa_tiedot}
      {rekisteroityjen_oikeudet_korjata}
      {rekisteroityjen_oikeudet_rajoittamiseen}
      {rekisteroityjen_oikeudet_poistamiseen}
      {rekisteroityjen_oikeudet_valitukseen}
      {evasteet}
      {muutokset_tietosuojaan}
      </div>
      </PageStyles>


  );
}

const PageStyles = styled.div`
  p {
    font-size: 2vh;
  }

  h1 {
    font-size: 4vh;
  }
`;
