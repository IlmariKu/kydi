import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import { convertDateToString } from "../../helpers/date.js";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fi from "date-fns/locale/fi";
registerLocale("fi", fi);

export function WhenLeaving(props) {
  const [isFlexible, setFlexible] = useState(false);
  const [hideDatePicker, setHideDatePicker] = useState(true);

  function dateSelected(date) {
    setHideDatePicker(true);
    props.setWhenLeavingDate(date);
  }

  function timeSelected(date) {
    props.setWhenLeavingTime(date);
  }

  const timeEstimates = [
    "Ei valittua aikaa",
    "Koko päivä",
    "Aamu",
    "Aamupäivä",
    "Iltapäivä",
    "Ilta",
    "Yö",
    "Lähtöpäivä voi joustaa",
    "Muu",
  ];

  return (
    <Styles>
      <section>
        <div hidden={hideDatePicker}>
          <DatePicker
            inline
            minDate={new Date()}
            locale="fi"
            selected={new Date()}
            onChange={(date) => dateSelected(date)}
          />
        </div>
        <div hidden={!hideDatePicker}>
          <Button
            onClick={() => setHideDatePicker(false)}
            className={"btn-sendmessage"}
          >
            {props.whenLeavingDate
              ? convertDateToString(props.whenLeavingDate)
              : "Valitse päivä"}
          </Button>
        </div>
        <div style={{ height: "4vh" }}></div>

        <Form>
          <Form.Label>Lähtöaika</Form.Label>
          <Form.Group>
            <Form.Control
              onChange={(event) => timeSelected(event.target.value)}
              as="select"
              style={{ fontSize: "3vh", height: "5vh" }}
            >
              {timeEstimates.map(function (time) {
                return <option key={time}>{time}</option>;
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      </section>
    </Styles>
  );
}

const Styles = styled.section`
  font-size: 3vh;
  width: 100%;
`;
