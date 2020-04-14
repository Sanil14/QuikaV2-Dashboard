import React, { Component } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import NavBar from "./NavBar";
import axios from "axios";
import { Container } from "react-bootstrap";
import "../css/dashboard.css";
import ServerModules from "./ServerModules";
import ServerEssential from "./ServerEssential";

class ServerHome extends Component {
  constructor(props) {
    super(props);
    this.guildid = this.props.match.params.guildId;
    this.axiosinstance = axios.create({
      baseURL: "/",
    });
    this.state = { guild: {}, module: {}, page: "modules" };
  }

  async componentDidMount() {
    if (this.guildid.length !== 18) {
      console.log("Invalid format");
      return this.props.history.push("/dashboard");
    }
    let g = await this.guildCheck(this.guildid);
    if (!g) return;
    let modules = await this.getModules(g.id);
    this.setState({ guild: g, module: modules });
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
                {Object.keys(this.state.guild).length > 0 ? (
                  <div>
                    <img
                      src={`${
                        "https://cdn.discordapp.com/icons/" +
                        this.state.guild.id +
                        "/" +
                        this.state.guild.icon +
                        ".png"
                      }`}
                      alt="Server Icon"
                      onClick={() => {
                        if (this.state.page === "modules") return;
                        this.changePage("modules");
                      }}
                    />
                    <h5 className="guildName">{this.state.guild.name}</h5>
                  </div>
                ) : (
                  <div>
                    <Skeleton circle={true} height={100} width={100} />
                    <br />
                    <div className="guildName">
                      <Skeleton height={30} width={90} />
                    </div>
                  </div>
                )}
              </div>
              <div className="section-body">
                <div
                  className="pagetitle centeralignbox"
                  style={{
                    minWidth:
                      this.state.page === "modules" ? "700px" : "1000px",
                  }}
                >
                  <p>{this.state.page}</p>
                </div>
                {this.state.page === "modules" ? (
                  <ServerModules
                    state={this.state}
                    changePage={this.changePage}
                    moduleset={this.setModule}
                  />
                ) : this.state.page === "Essentials" ? (
                  <ServerEssential
                    state={this.state}
                    changePage={this.changePage}
                    adminoverrideset={this.setAdminOverride}
                    adminoverrideget={this.getAdminOverride}
                    guildrolesget={this.getGuildRoles}
                    nodesget={this.getPermNodes}
                    rolepermadd={this.addRolePerm}
                    rolepermget={this.getRolePerm}
                    rolepermsget={this.getRolePerms}
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
    console.log(page);
    this.setState({ page: page });
  };

  async guildCheck(gid) {
    let { data } = await this.axiosinstance
      .get("/auth/guildcheck", {
        params: {
          gid: gid,
        },
      })
      .catch((err) => {
        return console.log(err);
      });
    console.log(data);
    if (data.hasOwnProperty("code")) {
      if (data.code === 401) {
        return this.props.history.push("/");
      }
    }
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

  setModule = async (mod, gid, checked) => {
    let data = await this.axiosinstance
      .get("/auth/setmodule", {
        params: {
          mod: mod.toLowerCase(),
          gid: gid,
          add: checked,
        },
      })
      .catch((error) => {
        return error;
      });
    let existing = JSON.parse(JSON.stringify(this.state.module));
    existing[mod].enabled = checked;
    this.setState({ module: existing });
    return data;
  };

  setAdminOverride = async (gid, checked) => {
    let data = await this.axiosinstance
      .get("/auth/setoverride", {
        params: {
          gid: gid,
          toggle: checked,
        },
      })
      .catch((err) => {
        return err;
      });
    return data;
  };

  getAdminOverride = async (gid) => {
    let res = await this.axiosinstance
      .get("/auth/getoverride", {
        params: {
          gid: gid,
        },
      })
      .catch((err) => {
        return console.log(err);
      });
    return res.data;
  };

  getGuildRoles = async (gid) => {
    let res = await this.axiosinstance
      .get("/auth/getgroles", {
        params: {
          gid: gid,
        },
      })
      .catch((err) => {
        return console.log(err);
      });
    return res.data;
  };

  getPermNodes = async () => {
    let res = await this.axiosinstance.get("/auth/getnodes").catch((err) => {
      return console.log(err);
    });
    return res.data;
  };

  addRolePerm = async (gid, perms) => {
    let res = await this.axiosinstance
      .get("/auth/addroleperm", {
        params: {
          gid: gid,
          perm: perms,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    return res;
  };

  getRolePerm = async (gid, role) => {
    let res = await this.axiosinstance
      .get("/auth/getroleperm", {
        params: {
          gid: gid,
          rid: role,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    return res.data;
  };

  getRolePerms = async (gid) => {
    let res = await this.axiosinstance
      .get("/auth/getroleperms", {
        params: {
          gid: gid,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    return res.data;
  };
}

export default ServerHome;
