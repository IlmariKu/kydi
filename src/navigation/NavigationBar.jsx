import React, { useState } from "react";
import { NavigationBrand } from "./NavigationBrand";
import styled from "styled-components";
import { Link, useLocation } from "wouter";

export function NavigationBar(props) {
  const [clicked, setClicked] = useState(false);
  const [wlocation, setLocation] = useLocation();

  function onClick(menuitem) {
    ga("send", "event", "menuclick", menuitem);
    setClicked(!clicked);
    if (menuitem === "sign_out") {
      props.signOut();
    } else if (menuitem === "search") {
      setLocation("/");
    } else {
      setLocation("/" + menuitem);
    }
  }

  return (
    <>
      <NavBarStyling>
        <NavigationBrand />
        <nav className="NavItems">
          <div className="menu-icon" onClick={() => setClicked(!clicked)}>
            <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
          </div>

          <ul className={clicked ? "nav-menu active" : "nav-menu"}>
            <div className="nav-links">
              <li className="menu-list" onClick={() => onClick("search")}>
                Haku
              </li>

              {props.isLoggedIn ? (
                <>
                  <li className="menu-list" onClick={() => onClick("profiili")}>
                    Profiili
                  </li>{" "}
                  <li className="menu-list" onClick={() => onClick("matkani")}>
                    Omat matkani
                  </li>
                  <li className="menu-list" onClick={() => onClick("sign_out")}>
                    Kirjaudu ulos
                  </li>
                </>
              ) : (
                <>
                  <li className="menu-list" onClick={() => onClick("about")}>
                    Kydistä
                  </li>

                  <li className="menu-list" onClick={() => onClick("palaute")}>
                    Anna palautetta
                  </li>
                  <li className="menu-list" onClick={() => onClick("kirjaudu")}>
                    Kirjaudu sisään
                  </li>

                  <li
                    className="menu-list"
                    onClick={() => onClick("rekisteroidy")}
                  >
                    Rekisteröidy
                  </li>
                </>
              )}
            </div>
          </ul>
        </nav>
      </NavBarStyling>
    </>
  );
}

const NavBarStyling = styled.div`

padding: 1rem 0 1rem 1rem;
display: flex;

a {
  border: none;
  color: #fff;
}

a:hover {
  text-decoration: none;
}



.NavItems {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
}

.nav-menu {
  list-style: none;
  text-align: center;
  width: 70vw;
  justify-content: end;
  margin-right: 2rem;
  transition: all 0.5s ease;

}

.nav-links {
  display: inline-flex;
}

li {
  color: white;
  text-decoration: none;
  padding: 0.5rem 2rem 0 0;
}

li:hover {
  border-bottom: 4px solid#007e98;
  border-radius: 4px;
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.fa-bars {
  color: #fff;
}


.menu-icon {
  display: none;
}



@media screen and (max-width: 876px) {
  position: relative;

  .nav-menu {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0px;
      right: 100%;
      transition: all 0.9s easeInOut;
  }

  .nav-menu.active {
    background: rgb(51, 174, 201);
    background: linear-gradient(
      90deg,
      rgba(51, 174, 201) 0%,
      rgba(57, 204, 223) 55%,
      rgba(48, 188, 196) 100%
    );
      left: 0;
      transition: all 0.9s easeinout;
      padding: 4em;
      z-index: 1;
      display: flex;
  }

  .nav-links {
    display: block;
  }

  .menu-list {
      text-align: center;
      margin-bottom: 2em;
      padding: 0rem 0rem 2rem 0;
      width: 100%;
      display: table;
  }

  .menu-list:nth-child(1) {
    text-align: center;
    margin-bottom: 2em;
    padding: 2rem 0rem 2rem 0;
    width: 100%;
    display: table;
}

  .menu-list:hover {
    background-color: #007e98;
    border: none;
      border-radius: 1rem;
      transition: 0.2s ease-in;
  }

  .menu-icon {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(-100%, 60%);
      font-size: 2rem;
      cursor: pointer;
      z-index: 3;
  }

  .fa-bars:hover {
    color: #007e98;
    transform: scaleX(1.2);
  }

  .fa-times:hover {
    color: #007e98;
    background-color: #fff;
    border-radius: 50%;
    padding: 0.1rem;



  }

  .i:hover {
    color: #7bffff;

  }
  .menu-icon:hover {
    color: #7bffff;

  }

  .fa-times {
      color: #fff;
      font-size: 2rem;
  }

  li-mobile {
      display: block;
      text-align: center;
      padding: 1.5rem;
      margin: 2rem auto;
      border-radius: 4px;
      width: 80%;
      background: #00a8ad;
      text-decoration: none;
      color: #fff;
      font-size: 1.5rem;
  }

  li-mobile:hover {
      background: #fff;
      color: #00a8ad;
      transition: 250ms;
  }
`;
