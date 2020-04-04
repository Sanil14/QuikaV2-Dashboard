import React, { Component } from "react";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NavBar from "./NavBar";
import { NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";

class ServerListing extends Component {
  constructor() {
    super();
    this.axios = "";
    this.state = { user: [], guild: [], hasList: true };
  }

  async componentDidMount() {
    this.axios = axios.create({
      baseURL: "/"
    });
    let auth = await this.isAuthenticated();
    if (auth) {
      console.log("User Authenticated!");
      let u = await this.getUserName();
      let guilds = [];
      let users = [];
      users.push(u);
      let g = await this.getGuilds();
      for (let i = 0; i < g.length; i++) {
        if (
          (JSON.parse(g[i].permissions) & 0x8) === 0x8 ||
          g[i].owner === true
        ) {
          let setg = await this.guildIsSetup(g[i].id.toString());
          guilds.push([g[i].id, g[i].name, g[i].icon, setg]);
        }
      }
      console.log(g)
      if (guilds.length < 1) {
        this.setState({ user: users, guild: guilds, hasList: false });
      } else {
        this.setState({ user: users, guild: guilds, hasList: true });
      }
    } else {
      return (window.location.href = "/");
    }
  }

  render() {
    return (
      <div>
        <SkeletonTheme color="#404040" heightlightColor="#494949">
          <header id="headerdash" className="fixed-top">
            <NavBar />
          </header>

          <section id="dashboard" className="d-flex align-items-center">
            <Container>
              <div className="section-title">
                <h2>Dashboard</h2>
                <p>Select a server to continue</p>
              </div>
              <div className="section-body">
                <div className="guilds">
                  {this.state.guild.length > 0 ? (
                    this.state.guild.map((g, i) => (
                      <NavLink
                        to={g[3] ? `/dashboard/${g[0]}` : `/invite?${g[0]}`}
                        key={i}
                      >
                        <div className="guild">
                          <div
                            style={{
                              backgroundImage: `url(${
                                g[2] != null
                                  ? "https://cdn.discordapp.com/icons/" +
                                    g[0] +
                                    "/" +
                                    g[2] +
                                    ".png"
                                  : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
                              })`
                            }}
                            className="guildIcon"
                          ></div>
                          <div className="guildName">
                            <span>{g[1]}</span>
                          </div>
                          <div className="guildBtn">
                            <span href="#" className="dash-btn">
                              {g[3] ? "Open Dashboard" : "Setup Quika"}
                            </span>
                          </div>
                        </div>
                      </NavLink>
                    ))
                  ) : this.state.hasList ? (
                    <div className="guild" href="#">
                      <div className="guildIcon">
                        <Skeleton circle={true} width={45} height={45} />
                      </div>
                      <div className="guildName">
                        <Skeleton height={25} width={150} />
                      </div>
                      <div className="guildBtn">
                        <Skeleton height={35} width={125} />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="noServers" style={{textAlign: "center"}}>
                      <h6>No servers were found :(</h6>
                    </div>
                  )}
                </div>
                <div className="helpertext" style={{textAlign: "center", fontSize: "14px", color: "#b0bac2"}}>
                  Did not find the server you were looking for? Relog to update server list
                </div>
              </div>
            </Container>
          </section>
        </SkeletonTheme>
      </div>
    );
  }

  async isAuthenticated() {
    let { data } = await this.axios.get("/auth/check");
    return data;
  }

  async getUserName() {
    let { data } = await this.axios.get("/auth/user");
    return data;
  }

  async getGuilds() {
    let { data } = await this.axios.get("/auth/guilds");
    return data;
  }

  async guildIsSetup(gid) {
    let { data } = await this.axios.get("/auth/guildissetup", {
      params: {
        id: gid
      }
    });
    return data;
  }
}

export default ServerListing;
