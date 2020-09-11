import React, { useState, useEffect } from "react";
import { Route, useLocation, Redirect, Switch } from "wouter";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { NavigationBar } from "./navigation/NavigationBar.jsx";
import { Search } from "./search/Search.jsx";
import { Footer } from "./info/Footer.jsx";
import { SearchResultView } from "./results/SearchResultView.jsx";
import { Ride } from "./results/Ride.jsx";
import { NewRide } from "./newride/NewRide.jsx";
import { Profile } from "./profile/Profile.jsx";
import { AboutUs } from "./info/AboutUs.jsx";
import { MainPageContent } from "./info/MainPageContent";
import { NewUser } from "./newuser/NewUser.jsx";
import { SmallNews } from "./info/SmallNews.jsx";
import { LaunchNews } from "./info/LaunchNews";
import { Login } from "./registration/Login.jsx";
import { PostExternalRides } from "./admin/PostExternalRides.jsx";
import { SiteFeedback } from "./info/SiteFeedback.jsx";
import { MyRides } from "./my-rides/MyRides.jsx";
import { MessageMain } from "./messaging/MessageMain.jsx";
import { MessageSuggestion } from "./messaging/parts/MessageSuggestion";
import { Registration } from "./registration/Registration.jsx";
import { PrivacyPolicy } from "./registration/PrivacyPolicy.jsx";
import {
  api_get,
  api_post,
  UPDATE_PROFILE_INFO_URL,
  SEARCH_RIDES_URL,
} from "./helpers/api.js";
import { cutShortUsername } from "./helpers/shortUserID.js";
import Auth from "@aws-amplify/auth";
import { isEmpty } from "lodash";
import queryString from "query-string";

export function Main(props) {
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [userID, setUserID] = useState(null);
  const [originField, setOriginField] = useState("");
  const [destinationField, setDestinationField] = useState("");
  const [whenGoing, setWhenGoing] = useState("today");
  const [wouterLocation, setLocation] = useLocation();
  const [firstName, setFirstName] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("That windowsinstallbefore event triggered");
    ga("send", "event", "windowinstallprompt", "started");
    e.preventDefault();
    deferredPrompt = e;
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        ga("send", "event", "windowinstallprompt", "accepted");
        console.log("User accepted the A2HS prompt");
      } else {
        ga("send", "event", "windowinstallprompt", "declined");
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  });

  async function isSignedIn() {
    const info = await Auth.currentUserInfo();
    try {
      if (info && "attributes" in info) {
        fetchUserInfo(info);
      } else {
        console.error("User not authenticated");
      }
    } catch {
      console.error("Error with login check");
      setLoggedIn(false);
      setUserID(null);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setUserID(null);
      setLoggedIn(false);
      setLocation("/?login=logout");
      sessionStorage.clear();
      location.reload();
    } catch (error) {
      console.error("error signing out: ", error);
    }
  }

  async function fetchUserInfo(info) {
    const user_id = info["username"];
    const fb_first_name = info["attributes"]?.nickname;
    sessionStorage.setItem("userID", user_id);
    setLoggedIn(true);
    setUserID(user_id);
    const lastLoginUpdate = {
      "user-id": user_id,
      "last-login": new Date().toISOString(),
    };
    if (!isEmpty(fb_first_name)) {
      lastLoginUpdate["first-name"] = fb_first_name;
    }
    const user_profile = await api_post(
      `${UPDATE_PROFILE_INFO_URL}`,
      lastLoginUpdate,
      true
    );
    const name = user_profile?.["first-name"];
    if (name) {
      setFirstName(name);
    } else {
      setLocation("/uusi-kayttaja");
    }
  }

  function eraseMessage() {
    setSuccessMessage("");
  }

  useEffect(() => {
    isSignedIn();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const login = queryString.parse(location.search)?.login;
    if (login && login === "success") {
      setSuccessMessage("Sisäänkirjautuminen onnistui!");
      setTimeout(eraseMessage, 5000);
    } else if (login && login === "logout") {
      setSuccessMessage("Uloskirjautuminen onnistui!");
      setTimeout(eraseMessage, 5000);
    } else {
      setSuccessMessage("");
    }
  }, [location.href]);

  return (
    <Container fluid>
      <NavigationBar isLoggedIn={isLoggedIn} signOut={signOut} />
      <div className="wrapper">
        <Row>
          <Col sm={3} xl={4}></Col>
          <Col sm={12} xl={4}>
            {successMessage && (
              <div className="alertBox">
                <div className="alertMessage">
                  <i className="fas fa-info-circle"></i>
                  {successMessage}
                </div>
              </div>
            )}

            <Switch>
              <Route path="/tulokset">
                <SearchResultView
                  originField={originField}
                  destinationField={destinationField}
                />
              </Route>
              <Route path="/profiili">
                {isLoggedIn ? (
                  <Profile userID={userID} firstName={firstName} />
                ) : (
                  <Redirect to={`/kirjaudu?r=na${
                    queryString.parse(location.search)?.id
                      ? `&user=${queryString.parse(location.search)?.id}`
                      : ""
                  }`} />
                )}
              </Route>
              <Route path="/kyyti">
                <Ride isLoggedIn={isLoggedIn} />
              </Route>
              <Route path="/ilmoita">
                <NewRide
                  requestOrRide={"ride"}
                  userID={userID}
                  originField={originField}
                  destinationField={destinationField}
                  setOriginField={setOriginField}
                  setDestinationField={setDestinationField}
                  firstName={firstName}
                  feedback={feedback}
                />
              </Route>

              <Route path="/viesti">
                {isLoggedIn ? (
                  <MessageMain
                    userID={userID}
                    shortUserID={cutShortUsername(userID)}
                    firstName={firstName}
                  />
                ) : (
                  <Redirect
                    to={`/kirjaudu?r=na${
                      queryString.parse(location.search)?.ride
                        ? `&ride=${queryString.parse(location.search)?.ride}`
                        : ""
                    }`}
                  />
                )}
              </Route>
              <Route path="/ehdota">
                <MessageSuggestion userID={userID} firstName={firstName} />
              </Route>
              <Route path="/pyynto">
                <NewRide
                  requestOrRide={"request"}
                  userID={userID}
                  originField={originField}
                  destinationField={destinationField}
                />
              </Route>
              <Route path="/uusi-kayttaja">
                <NewUser userID={userID} firstName={firstName} />
              </Route>
              <Route path="/palaute">
                <SiteFeedback />
              </Route>
              <Route path="/adminkyyti">
                <PostExternalRides />
              </Route>
              <Route path="/about">
                <AboutUs />
              </Route>
              <Route path="/kirjaudu">
                <Login
                  setUserID={setUserID}
                  setLoggedIn={setLoggedIn}
                  fetchUserInfo={fetchUserInfo}
                />
              </Route>
              <Route path="/rekisteroidy">
                <Registration />
              </Route>
              <Route path="/tietosuojaseloste">
                <PrivacyPolicy />
              </Route>
              <Route path="/uutiset">
                <SmallNews />
              </Route>
              <Route path="/LaunchNews">
                <LaunchNews />
              </Route>
              <Route path="/matkani">
                <MyRides />
              </Route>
              <Route path="/:rest*">
                <Search
                  originField={originField}
                  setOriginField={setOriginField}
                  destinationField={destinationField}
                  setDestinationField={setDestinationField}
                  whenGoing={whenGoing}
                  setWhenGoing={setWhenGoing}
                  originField={originField}
                  destinationField={destinationField}
                />
                <MainPageContent />
              </Route>
            </Switch>
          </Col>
        </Row>
      </div>
      <Footer />
    </Container>
  );
}
