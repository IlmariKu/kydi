import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { convertDateToString } from "../helpers/date.js";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from "date-fns/locale/fi";
registerLocale("fi", fi);
import { api_post, POST_NEW_RIDE_URL } from "../helpers/api.js";
import { FINNISH_CITIES } from "./cities.js";
import _ from "lodash";

export function PostExternalRides(props) {
  const [updateStatus, setUpdateStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [originSuggestionsOpen, setOriginSuggestionsOpen] = useState(false);
  const [originField, setOriginField] = useState("");
  const [destinationField, setDestinationField] = useState("");
  const [filteredText, changeFilteredText] = useState("");
  const [filterAlert, setFilterAlert] = useState(false);
  const [destinationSuggestionsOpen, setDestinationSuggestionsOpen] = useState(
    false
  );

  function onSubmit() {
    const linkField = document.getElementById("link");
    const externalField = document.getElementById("external_source");
    const timeField = document.getElementById("departure-time");
    const body = {
      origin: originField.toLowerCase(),
      destination: destinationField.toLowerCase(),
      "departure-date": selectedDate.toISOString(),
      "departure-time": !_.isEmpty(timeField.value)
        ? timeField.value
        : "Ei valittu",
      link: linkField.value,
      external: externalField.value,
    };
    api_post(POST_NEW_RIDE_URL, body, true);

    setUpdateStatus(
      `Latasit juuri kyydin ${originField} - ${destinationField}`
    );
    setOriginField("");
    setDestinationField("");
    linkField.value = "";
    externalField.value = "fb";
    timeField.value = "Ei valittu";
    setSelectedDate(new Date());
  }

  function getRelevantCities(search) {
    const relevant_cities = [];
    FINNISH_CITIES.forEach(function (city) {
      if (_.startsWith(city, search.toLowerCase())) {
        relevant_cities.push(city);
      }
    });
    return relevant_cities;
  }

  function createCityOptions(origOrDest) {
    const cities = origOrDest === "origin" ? originCities : destinationCities;
    const cityElements = cities.map(function (city) {
      return (
        <div
          key={`${origOrDest}_${city}`}
          onClick={() => selectCity(city, origOrDest === "origin")}
          style={{ fontSize: "4vh", marginTop: "2vh", cursor: "pointer" }}
        >
          {_.capitalize(city)}
        </div>
      );
    });
    if (_.isEmpty(cities)) {
      return null;
    }
    return (
      <div key={`${Math.random(0, 10000)}_cityOptions`}>
        {cityElements}
        <div
          key={`${origOrDest}_cityOptionsDivider`}
          style={{ height: "7vh" }}
        ></div>
      </div>
    );
  }

  function selectCity(city, isOrigin) {
    if (isOrigin) {
      setOriginField(_.capitalize(city));
      setOriginSuggestionsOpen(false);
    } else {
      setDestinationField(_.capitalize(city));
      setDestinationSuggestionsOpen(false);
    }
  }

  function searchCityOptions(searchword, isOrigin) {
    removeLinkErrorState();
    if (isOrigin) {
      setOriginField(searchword);
      if (searchword.length < 2) {
        setOriginSuggestionsOpen(false);
        return;
      }
      setOriginSuggestionsOpen(true);
      setOriginCities(getRelevantCities(searchword));
    } else {
      setDestinationField(searchword);
      if (searchword.length < 2) {
        setDestinationSuggestionsOpen(false);
        return;
      }
      setDestinationSuggestionsOpen(true);
      setDestinationCities(getRelevantCities(searchword));
    }
  }

  function dateSelected(date) {
    const rawDate = new Date(date);
    rawDate.setHours(4, 0, 0, 0);
    setSelectedDate(rawDate);
  }

  function removeLinkErrorState() {
    setFilterAlert(false);
    changeFilteredText("");
  }

  function stripFBlink(link) {
    function stripTracking(link) {
      if (link.includes("permalink")) {
        changeFilteredText("Normaali FB-keskustelu, leikattu");
        return link.slice(0, link.lastIndexOf("/"));
      } else if (link.includes("post_id")) {
        changeFilteredText("FB-kommentti, leikattu turhuudet");
        return link.slice(0, link.indexOf("__cft_"));
      } else {
        changeFilteredText("FB-kommentti, leikattu turhuudet");
      }
    }
    removeLinkErrorState();
    if (link.indexOf("http") === -1) {
      setFilterAlert(true);
      changeFilteredText("Ei http osaa olemassa");
      return;
    }
    var newLink = "";
    if (link.includes("facebook")) {
      newLink = link.slice(link.indexOf("http"));
      newLink = stripTracking(newLink);
    } else if (link.includes("kyydit")) {
      changeFilteredText("Kyyditnet-linkki");
      document.getElementById("external_source").value = "kyyditnet";
      newLink = link;
    } else {
      changeFilteredText("Ei tunnistettu tekstiä");
      setFilterAlert(true);
    }
    document.getElementById("link").value = newLink;
  }

  return (
    <div className="component-background-ride-view">
      <h2>{updateStatus}</h2>
      <Form autoComplete="off">
        <h2> Postaa kyyti</h2>
        <Form.Group controlId="origin">
          <Form.Label>Lähtökaupunki / -kunta</Form.Label>
          <Form.Control
            onChange={() => searchCityOptions(event.target.value, true)}
            onClick={() => setOriginSuggestionsOpen(true)}
            value={originField}
          />
        </Form.Group>
        {originSuggestionsOpen ? createCityOptions("origin") : null}

        <Form.Group controlId="destination">
          <Form.Label>Määränpää</Form.Label>
          <Form.Control
            onChange={() => searchCityOptions(event.target.value, false)}
            onClick={() => setDestinationSuggestionsOpen(true)}
            value={destinationField}
          />
        </Form.Group>
        {destinationSuggestionsOpen ? createCityOptions("destination") : null}

        <Form.Group controlId="link">
          <Form.Label>Linkki</Form.Label>
          <Form.Control onChange={() => stripFBlink(event.target.value)} />
        </Form.Group>
        <h3 style={{ color: filterAlert ? "red" : "green" }}>{filteredText}</h3>
        <div style={{ fontSize: "3vh" }}>
          {convertDateToString(selectedDate, true, true)}
        </div>

        <DatePicker
          inline
          minDate={new Date()}
          locale="fi"
          selected={selectedDate}
          onChange={(date) => dateSelected(date)}
        />

        <Form.Group controlId="external_source">
          <Form.Label>Lähde</Form.Label>
          <Form.Control defaultValue="fb" />
        </Form.Group>

        <Form.Group controlId="departure-time">
          <Form.Label>Lähtöaika</Form.Label>
          <Form.Control placeholder="valinnainen, vapaa teksti" />
        </Form.Group>

        <Button className={"btn-searchform"} block onClick={() => onSubmit()}>
          Lähetä kyyti
        </Button>
      </Form>
    </div>
  );
}
