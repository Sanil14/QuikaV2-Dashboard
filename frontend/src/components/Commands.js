import React, { Component } from "react";
import commandsList from "../json/commandsList";
import { Container } from 'react-bootstrap';

class Commands extends Component {
  constructor(props) {
    super(props);
    this.cmds = [];
    this.timeout = null;
    this.notfound = "";
  }

  render() {
    return (
      <Container>
        <div className="section-title">
          <h2>Commands</h2>
          <p>
            To get more information about a command, you can search the command
            here and get more details
          </p>
        </div>

        <div className="section-body">
          <div className="form-group" data-aos="fade-up">
            <input
              type="text"
              id="commandSearch"
              placeholder="Enter command to search"
              className="form-control"
              onKeyUp={this.searchDocs}
            />
            <small className="form-text text-warning">{this.notfound}</small>
          </div>
          <div className="cmds" data-aos="fade-up" data-aos-delay="150">
            {this.cmds.map(r => (
              <div className="cmd" key={r[0]}>
                <span className="cmdmain">{r[0]}</span>
                <span className="cmddesc">{r[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  searchDocs = e => {
    this.cmds = [];
    //console.log(this.cmds);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let searchv = document.getElementById("commandSearch").value.trim();
      if (!searchv || searchv.length < 1) {
        this.cmds = [];
        this.notfound = "";
        this.forceUpdate();
        return;
      }
      if (searchv.length < 3) {
        this.notfound = "Too small to search";
        this.forceUpdate();
        return;
      }
      let count = 0;
      for (const key in commandsList) {
        //console.log(commandsList[key].command);
        if (
          commandsList[key].command
            .toUpperCase()
            .indexOf(searchv.toUpperCase()) > -1 ||
          commandsList[key].desc.toUpperCase().indexOf(searchv.toUpperCase()) >
            -1
        ) {
          this.cmds.push([commandsList[key].command, commandsList[key].desc]);
          this.notfound = "";
          this.forceUpdate();
        } else {
          count += 1;
        }
      }
      if (count === Object.keys(commandsList).length) {
        this.notfound = "No results were found";
        this.forceUpdate();
      }
    }, 1000);
  };
}

export default Commands;
