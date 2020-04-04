import React, { Component } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NavBar from "./NavBar";
import axios from "axios";
import { Container } from "react-bootstrap";
import "../css/dashboard.css";
import ServerModules from "./ServerModules";
import ServerGeneral from "./ServerGeneral";

class ServerHome extends Component {
  constructor(props) {
    super(props);
    this.guildid = this.props.match.params.guildId;
    this.axiosinstance = "";
    this.state = { user: [], guild: {}, module: {}, page: "modules" };
  }

  async componentDidMount() {
    this.axiosinstance = axios.create({
      baseURL: "/",
    });
    let auth = await this.isAuthenticated();
    if (auth) {
      console.log("User Authenticated!");
      if (this.guildid.length !== 18) {
        console.log("Invalid format");
        return this.props.history.push("/dashboard");
      }
      let u = await this.getUserName();
      let guilds = {},
        users = [],
        counter = { s: false, u: 0 };
      users.push(u);
      let g = await this.getGuilds();
      for (let i = 0; i < g.length; i++) {
        if (
          (JSON.parse(g[i].permissions) & 0x8) === 0x8 ||
          g[i].owner === true
        ) {
          let setg = await this.guildIsSetup(g[i].id.toString());
          if (g[i].id !== this.guildid) counter.u += 1;
          if (setg && g[i].id === this.guildid) {
            counter.s = true;
            guilds["id"] = g[i].id;
            guilds["name"] = g[i].name;
            guilds["icon"] = g[i].icon;
          }
        }
      }
      if (counter.u === guilds.length || !counter.s) {
        console.log("SERVER NOT FOUND");
        return this.props.history.push("/dashboard");
      }
      let modules = await this.getModules(guilds.id);
      this.setState({ user: users, guild: guilds, module: modules });
      console.log(this.state);
    } else {
      return this.props.history.push("/");
    }
  }

  render() {
    return (
      <div>
        <SkeletonTheme color="#404040" heightlightColor="#494949">
          <header id="headerdash" className="fixed-top">
            <NavBar />
          </header>

          <section id="dashboardHome" className="d-flex align-items-center">
            <Container>
              <div className="section-image section-title">
                <img
                  src={`${
                    "https://cdn.discordapp.com/icons/" +
                    this.state.guild.id +
                    "/" +
                    this.state.guild.icon +
                    ".png"
                  }`}
                  alt="Server Icon"
                />
                <h5>{this.state.guild.name}</h5>
              </div>
              <div className="section-body">
                {this.state.page === "modules" ? (
                  <ServerModules
                    state={this.state}
                    changePage={this.changePage}
                    moduleset={this.setModule}
                  />
                ) : this.state.page === "general" ? (
                  <ServerGeneral
                    state={this.state}
                    changePage={this.changePage}
                  />
                ) : (
                  "WotDahlell"
                )}
              </div>
            </Container>
          </section>
        </SkeletonTheme>
      </div>
    );
  }

  changePage = (page) => {
    //var state = { ...this.state };
    //state.page = page;
    //console.log(state);
    this.setState({ page: page });
  };

  async isAuthenticated() {
    let { data } = await this.axiosinstance.get("/auth/check");
    return data;
  }

  async getUserName() {
    let { data } = await this.axiosinstance.get("/auth/user").catch((error) => {
      return console.log(error);
    });
    return data;
  }

  async getGuilds() {
    let { data } = await this.axiosinstance.get("/auth/guilds");
    return data;
  }

  async guildIsSetup(gid) {
    let { data } = await this.axiosinstance
      .get("/auth/guildissetup", {
        params: {
          id: gid,
        },
      })
      .catch((error) => {
        return console.log(error);
      });
    return data;
  }

  async getModules(gid) {
    let { data } = await this.axiosinstance
      .get("/auth/modules", {
        params: {
          id: gid,
        },
      })
      .catch((error) => {
        return console.log(error);
      });
    return data;
  }

  setModule = async (module, gid, checked) => {
    let data = await this.axiosinstance
      .get("/auth/setmodule", {
        params: {
          mod: module,
          gid: gid,
          add: checked,
        },
      })
      .catch((error) => {
        return error;
      });
    return data;
  };
}

export default ServerHome;
