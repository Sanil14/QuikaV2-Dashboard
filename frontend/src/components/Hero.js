import React from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Logo from "../assets/logos/q_svg.svg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <Container>
      <Row>
        <Col
          lg="6"
          className="d-lg-flex flex-lg-column justify-content-center align-items-stretch pt-5 pt-lg-0 order-2 order-lg-1"
          data-aos="fade-up"
        >
          <div>
            <h1>A Multipurpose Discord Bot</h1>
            <h2>A modular discord bot ideal for every server.</h2>
            <Link to="#" className="hero-btn">
              <i className="bx bxl-discord"></i> Add to Discord
            </Link>
            <Link to="#features" className="hero-btn scrollto">
              <i className="bx bxs-info-circle"></i> Learn More
            </Link>
          </div>
        </Col>
        <Col
          lg="6"
          className="d-lg-flex flex-lg-column align-items-stretch order-1 order-lg-2 hero-img"
          data-aos="fade-up"
        >
          <img
            src={Logo}
            className="img-fluid"
            alt="Quika Logo"
            height="480px"
            width="480px"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Hero;
