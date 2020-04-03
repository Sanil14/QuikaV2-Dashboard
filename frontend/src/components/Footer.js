import React from "react";
import { Container } from 'react-bootstrap';
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
      <div className="footer-top">
        <Container>
          <Row>
            <Col className="footer-contact" data-aos="fade-up">
              <h3>Quika</h3>
              <p>
                <strong>Owned By:</strong> Sanil#2634
                <br />
                <strong>Email:</strong> quikateam@gmail.com
                <br />
              </p>
            </Col>

            <div
              className="col footer-links"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <Link to="#header" className="scrollto">
                    Home
                  </Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <Link to="#features" className="scrollto">
                    Features
                  </Link>
                </li>
                <li>
                  <i className="bx bx-chevron-right"></i>{" "}
                  <Link to="#commands" className="scrollto">
                    Commands
                  </Link>
                </li>
              </ul>
            </div>

            <Col
              className="footer-links"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <h4>Our Social Networks</h4>
              <div className="social-links mt-3">
                <Link to="#" className="discord">
                  <i className="bx bxl-discord"></i>
                </Link>
                <Link to="#" className="twitter">
                  <i className="bx bxl-twitter"></i>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <div className="copyright">
          &copy; Copyright{" "}
          <strong>
            <span>Quika</span>
          </strong>
          . All Rights Reserved
        </div>
      </Container>
    </div>
  );
}

export default Footer;
