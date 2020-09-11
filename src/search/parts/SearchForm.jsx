import React, { useState } from "react";
import { useLocation } from "wouter";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";
import _ from "lodash";
import { FINNISH_CITIES } from "./cities.js";

export default function SearchForm(props) {
  const [location, setLocation] = useLocation();
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [originSuggestionsOpen, setOriginSuggestionsOpen] = useState(false);
  const [destinationSuggestionsOpen, setDestinationSuggestionsOpen] = useState(
    false
  );

  function getRides() {
    ga("send", "event", "search", "searchStarted");
    const destination = document.getElementById("destination").value;
    const origin = document.getElementById("origin").value;
    var dest = destination ? destination.toLowerCase() : null;
    var orig = origin ? origin.toLowerCase() : null;
    ga("send", "event", "search", dest);
    ga("send", "event", "search", orig);
    ga("send", "event", "searchFull", `${orig - dest}`);
    if (orig && dest) {
      setLocation(`/tulokset?origin=${orig}&destination=${dest}`);
    } else if (orig) {
      setLocation(`/tulokset?origin=${orig}`);
    } else if (dest) {
      setLocation(`/tulokset?destination=${dest}`);
    } else {
      setLocation(`/tulokset`);
    }
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

  function openNewRideProcess() {
    ga("send", "event", "newRide", "opened");
    setLocation("/ilmoita");
  }

  function searchCityOptions(searchword, isOrigin) {
    if (isOrigin) {
      props.setOriginField(searchword);
      if (searchword.length < 2) {
        setOriginSuggestionsOpen(false);
        return;
      }
      setOriginSuggestionsOpen(true);
      setOriginCities(getRelevantCities(searchword));
    } else {
      props.setDestinationField(searchword);
      if (searchword.length < 2) {
        setDestinationSuggestionsOpen(false);
        return;
      }
      setDestinationSuggestionsOpen(true);
      setDestinationCities(getRelevantCities(searchword));
    }
  }

  function selectCity(city, isOrigin) {
    ga("send", "event", "city", "search", "citySelected");
    if (isOrigin) {
      props.setOriginField(_.capitalize(city));
      setOriginSuggestionsOpen(false);
    } else {
      props.setDestinationField(_.capitalize(city));
      setDestinationSuggestionsOpen(false);
    }
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

  return (
    <div>
      <section className="component-background-mainform">
        <Form autoComplete="off">
          <Form.Group controlId="origin">
            <Form.Label>Lähtökaupunki / kunta</Form.Label>
            <Form.Control
              style={{ fontSize: "3.5vh" }}
              onChange={() => searchCityOptions(event.target.value, true)}
              onClick={() => setOriginSuggestionsOpen(true)}
              placeholder="Oulu, Kempele"
              value={props.originField}
            />
          </Form.Group>
          {originSuggestionsOpen ? createCityOptions("origin") : null}
          <Form.Group controlId="destination">
            <Form.Label>Määränpää</Form.Label>
            <Form.Control
              style={{ fontSize: "3.5vh" }}
              onChange={() => searchCityOptions(event.target.value, false)}
              onClick={() => setDestinationSuggestionsOpen(true)}
              placeholder="Helsinki, Tampere"
              value={props.destinationField}
            />
          </Form.Group>
          {destinationSuggestionsOpen ? createCityOptions("destination") : null}

          {props.lookingOrPosting === "isLooking" ? (
            <Form.Group controlId="when_going">
              <Form.Label>Milloin menet? </Form.Label>
              <Tab.Container id="left-tabs-example" defaultActiveKey="today">
                <Row>
                  <Col sm={12} style={{ fontSize: "3.5vh" }}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link
                          onClick={() => props.setWhenGoing("today")}
                          eventKey="today"
                        >
                          Tänään
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          onClick={() => props.setWhenGoing("tomorrow")}
                          eventKey="tomorrow"
                        >
                          Huomenna
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          onClick={() => props.setWhenGoing("later")}
                          eventKey="later"
                        >
                          Myöhemmin
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                </Row>
              </Tab.Container>
            </Form.Group>
          ) : null}
        </Form>
      </section>
      {props.lookingOrPosting === "isLooking" ? (
        <Button
          onClick={() => getRides()}
          type="submit"
          className={"btn-searchform-start"}
          block
        >
          {_.isEmpty(props.destinationField) && _.isEmpty(props.originField) ? "Selaa kaikkia " : "Hae "}
          <i className="fas fa-search fa-rotate-90"></i>
        </Button>
      ) : (
        <Button
          onClick={() => openNewRideProcess()}
          type="submit"
          className={"btn-searchform-start"}
          block
        >
          Ilmoita <i className="fas fa-bullhorn"></i>
        </Button>
      )}
    </div>
  );
}
