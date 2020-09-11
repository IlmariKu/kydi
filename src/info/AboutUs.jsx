import React from "react";
import { Link } from "wouter";

export const AboutUs = () => {
  return (
    <div className="component-background-ride-view">
      <h2>Kydin tarina</h2>
      <p>
        Aika on marraskuu 2018. Olen menossa Helsingistä kotiin jouluksi Lappiin
        vanhempieni luokse, kuten joka joulu ja edessä on jokavuotinen pulma.
        Miten pääsen perille kotiini? Olen myöhässä ostamassa junalippuja,
        joiden hinnat ja saatavuus ovat pilvissä. Lentolipuille sama juttu, ei
        mitään toivoa. En edes halua matkustaa kummallakaan vaihtoehdolla!
        Haluaisin vain jakaa kustannukseni ja tutustua uusiin ihmisiin matkan
        aikana.
      </p>

      <p>
        Tiesin toki, että monet ovat ajamassa jouluksi Rovaniemelle. En tiedä
        kuinka moni, mutta paljon. Voisin vain hypätä jonkun muun kyytiin ja
        osallistua bensakuluihin. Liityn FB-ryhmiin ja kokeilen olemassaolevia
        nettisivuja. Ei onnistumista. Kaikki palvelut olivat ihan hirveitä. Eikö
        tätä tosiaan voi tehdä paremmin? Olen käyttänyt niin montaa hyvää
        nettipalvelua, miksi kimppakyytien jakaminen on näin tehotonta?
      </p>

      <p>
        Asia jää mieleen ja vuoden päästä mietin asiaa edelleen. Jätän
        päivätyöni ja pari kuukautta myöhemmin, Kydi on olemassa. Olenko tosiaan
        ainoa ihminen joka ajattelee, että kimppakyydit pitäisi järjestää
        paremmin?
      </p>

      <p>
        Mukaan koodaamaan hyppäsivät myös Minja ja Juho. Yhdessä me tehtiin
        Kydistä juttu, jota juuri nyt käytät. Emme tiedä vielä miten tässä käy
        ja jos haluat sanoa jotain niin{" "}
        <Link style={{ color: "blue" }} href="/palaute">
          meille voi jättää helposti palautetta!
        </Link>
      </p>
      <p>
        Toivomme, että viihdyt Kydin parissa!
      </p>
      <p>Ilmari, Minja, Juho</p>
    </div>
  );
};
