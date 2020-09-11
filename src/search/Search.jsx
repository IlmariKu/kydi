import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchForm from "./parts/SearchForm.jsx";
import { Login } from "../registration/Login"; 
import { RidingOrPosting } from "./parts/RidingOrPosting.jsx";
import { api_get } from "../helpers/api.js";
import _ from "lodash";



export function Search(props) {
  const [lookingOrPosting, setLookingOrPosting] = useState("isLooking");

  return (
    <SearchPage>
      <RidingOrPosting
        lookingOrPosting={lookingOrPosting}
        setLookingOrPosting={setLookingOrPosting}
      />
      <SearchForm
        lookingOrPosting={lookingOrPosting}
        getRides={props.getRides}
        originField={props.originField}
        setOriginField={props.setOriginField}
        destinationField={props.destinationField}
        setDestinationField={props.setDestinationField}
        whenGoing={props.whenGoing}
        setWhenGoing={props.setWhenGoing}
        originAndDestinationGiven={
          !_.isEmpty(props.originField) && !_.isEmpty(props.destinationField)
        }
      />
    </SearchPage>
  );
}

const SearchPage = styled.div``;
