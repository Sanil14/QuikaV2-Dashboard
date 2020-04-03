import React from "react";
import "react-bootstrap";
import { Container } from 'react-bootstrap';
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Logo from "../assets/logos/q_svg.svg";

function Features() {
  return (
    <Container>
      <div className="section-title">
        <h2>Features</h2>
        <p>
          By introducing modules, Quika reduces feature bloat for your discord
          server and gives you what you want.
        </p>
        <p>Nothing more, nothing less.</p>
      </div>

      <Row noGutters>
        <Col xl="7" className="d-flex align-items-stretch order-2 order-lg-1">
          <div className="content d-flex flex-column justify-content-center">
            <Row>
              <Col md="6" className="icon-box" data-aos="fade-up">
                <i className="bx bxs-lock-alt"></i>
                <h4>Hierarchy based Permissions</h4>
                <p>Rigid and easy to understand permissions system</p>
              </Col>
              <Col
                md="6"
                className="icon-box"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <i className="bx bxs-dashboard"></i>
                <h4>Server-ready Dashboard</h4>
                <p>Simple and robust interface covering all features</p>
              </Col>
              <Col
                md="6"
                className="icon-box"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <i className="bx bxs-music"></i>
                <h4>Plug & Play Music</h4>
                <p>Play high quality music anywhere from youtube</p>
              </Col>
              <Col
                md="6"
                className="icon-box"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <i className="bx bx-shield"></i>
                <h4>Strong moderation system</h4>
                <p>Regain control over your server against spammers</p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col
          xl="5"
          className="image d-flex align-items-stretch justify-content-center order-1 order-lg-2"
          data-aos="fade-left"
          data-aos-delay="100"
        >
          <img src={Logo} className="img-fluid" alt="" />
        </Col>
      </Row>
    </Container>
  );
}

export default Features;
