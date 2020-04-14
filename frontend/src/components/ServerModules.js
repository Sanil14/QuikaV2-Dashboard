import React, { Component } from "react";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Skeleton from "react-loading-skeleton";
import Toast from "light-toast";
import { withRouter } from "react-router-dom";

class ServerModules extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="centeralignbox">
        {Object.keys(this.props.state.module).length > 0 ? (
          Object.keys(this.props.state.module).map((name, i) => (
            <div className="module" key={i}>
              <a
                onClick={() => {
                  if (!this.props.state.module[name].enabled && name !== "Essentials") return;
                  this.updatePage(name);
                }}
                className="moduleNameIcon"
              >
                <div className="moduleName">
                  <span>{name}</span>
                </div>
                <div className="moduleDesc">
                  <span>{this.props.state.module[name].desc}</span>
                </div>
              </a>
              <div className="moduleToggle">
                <BootstrapSwitchButton
                  checked={
                    name === "Essentials"
                      ? true
                      : this.props.state.module[name].enabled
                  }
                  onstyle="success"
                  onlabel="ON"
                  offstyle="dark"
                  offlabel="OFF"
                  disabled={name === "Essentials" ? true : false}
                  onChange={async (checked) => {
                    await this.toggleButton(name, checked);
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="module">
            <div className="moduleNameIcon">
              <div className="moduleName">
                <div className="bx">
                  <Skeleton circle={true} width={20} height={20} />
                </div>
                <Skeleton height={20} width={70} />
              </div>
            </div>
            <div className="moduleToggle">
              <Skeleton height={35} width={50} />
            </div>
          </div>
        )}
        <div id="helpertext">
          To access the module settings, enable it first
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

export default withRouter(ServerModules);
