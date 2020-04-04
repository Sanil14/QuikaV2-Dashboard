import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import Toast from "light-toast";
import { withRouter } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { user: [] };
    this.button = "";
    this.logout = "";
    this.axiosinstance = axios.create({
      baseURL: "/"
    });
  }

  async componentDidMount() {
    let auth = await this.isAuthenticated();
    if (!auth) return this.button = "";
    if (auth.data) {
      let u = await this.getUserName();
      this.setState({ user: u });
      this.button = (
        <li className="loggedinbutton">
          <div className="dropdown">
            <div
              className="d-flex"
              id="dropdownLoggedin"
              role="button"
              data-toggle="dropdown"
              data-display="static"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div
                style={{
                  backgroundImage: `url(${"https://cdn.discordapp.com/avatars/" +
                    this.state.user[1] +
                    "/" +
                    this.state.user[2] +
                    ".png"})`
                }}
                className="avatar"
              ></div>
              <span>{this.state.user[0]}</span>
            </div>
            <div
              className="dropdown-menu dropdown-menu-right animate slideIn"
              aria-labelledby="dropdownLoggedin"
            >
              <Link className="dropdown-item db" to="/dashboard">
                Dashboard
              </Link>
              <Link
                to="#"
                className="dropdown-item logout"
                onClick={this.logt.bind(this)}>
                Logout
              </Link>
              <Link to="/invite" className="dropdown-item invite">
                Invite Bot
              </Link>
            </div>
          </div>
        </li>
      );
      this.forceUpdate();
    } else {
      this.button = (
        <li className="get-started" onClick={this.oauthredirect}>
          <div>
            <span>Login</span>
          </div>
        </li>
      );
      this.logout = "";
      this.forceUpdate();
    }
  }

  render() {
    return (
      <Container className="d-flex">
        <div className="logo mr-auto">
          <h1 className="text-light">
            <Link to="/">Quika</Link>
          </h1>
        </div>

        <nav className="nav-menu d-none d-lg-block">
          <ul>
            <li>
              <Link to="/#header" className="active scrollto">
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/#features" className="scrollto">
                <span>Features</span>
              </Link>
            </li>
            <li>
              <Link to="/#commands" className="scrollto">
                <span>Commands</span>
              </Link>
            </li>
            {this.button}
          </ul>
        </nav>
      </Container>
    );
  }

  async handleError(error) {
    if (
      error.response.status === 500 ||
      error.response.statusText === "Internal Server Error"
    ) {
      Toast.fail("Server not responding. Please try again later.", 5000, () => {
        return this.props.history.push("/");
      });
    }
  }

  oauthredirect = () => {
    window.location.href = "http://localhost:5000/login";
  };

  logt() {
    console.log("Logout initiated");
    this.axiosinstance.get("/auth/logout").then(d => {
      console.log(d.data);
      window.location.reload();
    });
  }

  async isAuthenticated() {
    let data = await this.axiosinstance
      .get("/auth/check")
      .catch(async error => {
        if (window.location.pathname !== "/") {
          return await this.handleError(error);
        } else {
          this.connection = false;
        }
      });
    return data;
  }

  async getUserName() {
    let { data } = await this.axiosinstance.get("auth/user");
    return data;
  }
}

export default withRouter(NavBar);
