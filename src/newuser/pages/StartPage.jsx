import React from "react";

export function StartPage(props) {
  return (
    <>
      <p>
        <b>{`Tervetuloa Kydiin ${
          props.existFirstName ? props.existFirstName : ""
        } ! 👋🏻`}</b>
      </p>
      <p>
        Ennen kuin olet täysin mukana, kysyisimme sinulta vielä muutaman jutun!
      </p>
      <p>
        Ainoastaan etunimi on pakollinen, mutta profiilikuva ja lyhyt teksti
        itsestäsi kertova sinusta paljon muille kyytiläisille.
      </p>
      <p>
        Profiilisi näkyy muille käyttäjille ainoastaan jos ilmoitat kyydin tai olet
        hakemassa sellaista, kuten osallistut chattiin.
      </p>
    </>
  );
}
