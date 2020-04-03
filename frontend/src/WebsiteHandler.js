import React, { Component, Fragment } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Commands from "./components/Commands";
import Footer from "./components/Footer";

class Website extends Component {
  render() {
    return (
      <Fragment>
        <header id="header" className="fixed-top">
          <NavBar/>
        </header>

        <section id="hero" className="d-flex align-items-center">
          <Hero />
        </section>

        <main id="main">
          <section id="features" className="features">
            <Features />
          </section>

          <section id="commands" className="commands">
            <Commands />
          </section>
        </main>

        <footer id="footer">
          <Footer />
        </footer>

        <a className="back-to-top" href="/">
          <i className="icofont-simple-up"></i>
        </a>
      </Fragment>
    );
  }
}

export default Website;
