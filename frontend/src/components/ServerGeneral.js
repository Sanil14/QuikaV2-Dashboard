import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NavBar from "./NavBar";
import axios from "axios";
import { Container } from "react-bootstrap";
import "../css/dashboard.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Toast from "light-toast";

class ServerGeneral extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default ServerGeneral;
