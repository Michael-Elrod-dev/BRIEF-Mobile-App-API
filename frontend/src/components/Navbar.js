import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css"
import {GiSolarSystem} from "react-icons/gi"
import {FaBars, FaTimes} from "react-icons/fa"

function NavBar() {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

{/* <img
        src="assets/images/BRIEFLogo.png"
        alt="BRIEF"
        width="75px"
        height="auto"
      /> */}

    return (
        <>
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
                    <GiSolarSystem className="navbar-icon" onClick={closeMobileMenu}/>
                    BRIEF
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    {click ? <FaTimes /> : <FaBars />}
                </div>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                <li className="nav-item">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Administration
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/assignments"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Assignments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/students"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Students
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/overview"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Overview
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
    </>
  );
}

export default NavBar;