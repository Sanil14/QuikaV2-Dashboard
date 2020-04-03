import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WebsiteHandler from "./WebsiteHandler";
import ServerHome from "./components/ServerHome";
import ServerListing from "./components/ServerListing";
import NotFound from "./components/NotFound";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={WebsiteHandler} />
          <Route exact path="/dashboard" component={ServerListing} />
          <Route exact path="/dashboard/:guildId" component={ServerHome} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
