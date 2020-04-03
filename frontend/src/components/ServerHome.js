import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NavBar from "./NavBar";
import axios from "axios";
import { Container } from "react-bootstrap";
import "../css/dashboard.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Toast from "light-toast";

class ServerHome extends Component {
  constructor(props) {
    super(props);
    this.guildid = this.props.match.params.guildId;
    this.axiosinstance = "";
    this.state = { user: [], guild: {}, module: {} };
  }

  async componentDidMount() {
    this.axiosinstance = axios.create({
      baseURL: "/"
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
                  src={`${"https://cdn.discordapp.com/icons/" +
                    this.state.guild.id +
                    "/" +
                    this.state.guild.icon +
                    ".png"}`}
                />
                <h5>{this.state.guild.name}</h5>
              </div>
              <div className="section-body">
                <div className="modules">
                  {/* Use ServerListing row code for listing modules
                    That module will dynamically change only the contents 
                    from below the servername and will show relevant data.
                 */}
                  {
                    <div>
                      <div className="module">
                        <NavLink to={true ? `/dashboard/` : `/invite?`}>
                          <div className="moduleName">
                            <i className="bx bx-detail"></i>
                            <span>General</span>
                          </div>
                        </NavLink>
                        <div className="moduleToggle">
                          <BootstrapSwitchButton
                            checked={this.state.module.Generic}
                            onstyle="success"
                            onlabel="ON"
                            offstyle="dark"
                            offlabel="OFF"
                            onChange={async checked => {
                              await this.toggleButton("generic", checked);
                            }}
                          />
                        </div>
                      </div>
                      <div className="module">
                        <NavLink to={true ? `/dashboard/` : `/invite?`}>
                          <div className="moduleName">
                            <i className="bx bx-wrench"></i>
                            <span>Moderation</span>
                          </div>
                        </NavLink>
                        <div className="moduleToggle">
                          <BootstrapSwitchButton
                            checked={this.state.module.Mod}
                            onstyle="success"
                            onlabel="ON"
                            offstyle="dark"
                            offlabel="OFF"
                            onChange={async checked => {
                              await this.toggleButton("mod", checked);
                            }}
                          />
                        </div>
                      </div>
                      <div className="module">
                        <NavLink to={true ? `/dashboard/` : `/invite?`}>
                          <div className="moduleName">
                            <i className="bx bx-music"></i>
                            <span>Music</span>
                          </div>
                        </NavLink>
                        <div className="moduleToggle">
                          <BootstrapSwitchButton
                            checked={this.state.module.Music}
                            onstyle="success"
                            onlabel="ON"
                            offstyle="dark"
                            offlabel="OFF"
                            onChange={async checked => {
                              await this.toggleButton("music", checked);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </Container>
          </section>
        </SkeletonTheme>
      </div>
    );
  }

  async toggleButton(mod, checked) {
    Toast.loading("Updating...");
    let res = await this.setModule(mod, this.state.guild.id, checked);
    if (res.status === 200) {
      Toast.success("Settings Updated", 500);
    } else {
      Toast.fail("Try again later", 500);
    }
  }

  async isAuthenticated() {
    let data = await this.axiosinstance
      .get("/auth/check")
      .catch(async error => {
        return await this.handleError(error);
      });
    return { data };
  }

  async getUserName() {
    let data = await this.axiosinstance.get("/auth/user").catch(error => {
      return console.log(error);
    });
    return { data };
  }

  async getGuilds() {
    let { data } = await this.axiosinstance.get("/auth/guilds");
    return data;
  }

  async guildIsSetup(gid) {
    let { data } = await this.axiosinstance
      .get("/auth/guildissetup", {
        params: {
          id: gid
        }
      })
      .catch(error => {
        return console.log(error);
      });
    return data;
  }

  async getModules(gid) {
    let data = await this.axiosinstance
      .get("/auth/modules", {
        params: {
          id: gid
        }
      })
      .catch(error => {
        return console.log(error);
      });
    return { data };
  }

  async setModule(module, gid, checked) {
    let data = await this.axiosinstance
      .get("/auth/setmodule", {
        params: {
          mod: module,
          gid: gid,
          add: checked
        }
      })
      .catch(error => {
        return error;
      });
    return data;
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
}

export default ServerHome;
