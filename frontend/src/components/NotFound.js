import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logos/q_svg.svg";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

class NotFound extends Component {
  render() {
    return (
      <section id="notfound" className="d-flex align-items-center">
        <div className="container">
          <div className="row">
            <Col
              lg="12"
              className="d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0"
              align="center"
            >
              <div>
                <img
                  src={Logo}
                  className="img-fluid"
                  height="256px"
                  width="256px"
                  alt="Quika Logo"
                />
              </div>
            </Col>
          </div>
          <Row>
            <Col
              lg="12"
              className="d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0"
              align="center"
            >
              <div>
                <h1 className="justify-center">404 Not Found</h1>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              lg="12"
              className="d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0"
              align="center"
            >
              <div>
                <Link to="/" className="hero-btn">
                  <i className="bx bx-arrow-back"></i> Go Back
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    );
  }
}

export default NotFound;
