import React, { Component } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { NavLink } from "react-router-dom";
import Toast from "light-toast";

class ServerModules extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="modules">
        <div>
          <div className="module">
            <NavLink to={true ? `/dashboard/` : `/invite?`}>
              <div className="moduleName">
                <i className="bx bxs-copy"></i>
                <span>Essential</span>
              </div>
            </NavLink>
            <div className="moduleToggle">
              <BootstrapSwitchButton
                checked={true}
                onstyle="success"
                onlabel="ON"
                offstyle="dark"
                offlabel="OFF"
                disabled
              />
            </div>
          </div>
          <div
            className="module"
            onClick={(param) => this.updatePage("general")}
          >
            <a>
              <div className="moduleName">
                <i className="bx bx-detail"></i>
                <span>General</span>
              </div>
            </a>
            <div className="moduleToggle">
              <BootstrapSwitchButton
                checked={this.props.state.module.Generic}
                onstyle="success"
                onlabel="ON"
                offstyle="dark"
                offlabel="OFF"
                onChange={async (checked) => {
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
                checked={this.props.state.module.Mod}
                onstyle="success"
                onlabel="ON"
                offstyle="dark"
                offlabel="OFF"
                onChange={async (checked) => {
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
                checked={this.props.state.module.Music}
                onstyle="success"
                onlabel="ON"
                offstyle="dark"
                offlabel="OFF"
                onChange={async (checked) => {
                  await this.toggleButton("music", checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  updatePage = (page) => {
    this.props.changePage(page);
  };

  async toggleButton(mod, checked) {
    Toast.loading("Updating...");
    let res = await this.props.moduleset(
      mod,
      this.props.state.guild.id,
      checked
    );
    if (res.status === 200) {
      Toast.success("Settings Updated", 150);
    } else {
      Toast.fail("Server not responding. Please try again later.", 500);
      this.props.history.push("/");
    }
  }
}

export default ServerModules;
