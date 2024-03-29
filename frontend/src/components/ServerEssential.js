import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Toast from "light-toast";
import "bootstrap-select";
import $ from "jquery";
import { Row, Table } from "react-bootstrap";
import "../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

class ServerEssential extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      ownerOverride: false,
      nodes: [],
      rolePerm: {
        roles: [],
        errormsg: "",
        addButton: "Add",
        selectedRole: 0,
        permissions: [],
      },
      userPerm: {
        users: [],
        errormsg: "",
        addButton: "Add",
        selectedUser: 0,
        permissions: [],
      },
    };
  }

  updaterolestate(field, val) {
    this.setState((prevState) => {
      let rperm = { ...prevState.rolePerm };
      rperm[field] = val;
      return { rolePerm: rperm };
    });
  }

  updateuserstate(field, val) {
    this.setState((prevState) => {
      let rperm = { ...prevState.userPerm };
      rperm[field] = val;
      return { userPerm: rperm };
    });
  }

  async componentDidMount() {
    if (Object.keys(this.props.state.guild).length < 1) return;
    let toggle = await this.props.adminoverrideget(this.props.state.guild.id);
    let roles = await this.props.guildrolesget(this.props.state.guild.id);
    let nodes = await this.props.nodesget();
    let users = await this.props.usersget(this.props.state.guild.id);
    await this.updateStatePermsRole();
    await this.updateStatePermsUser();
    if (toggle === 1) toggle = true;
    else toggle = false;
    roles.sort(function (a, b) {
      return b.rawPosition - a.rawPosition;
    });
    this.setState({
      ownerOverride: toggle,
      nodes: nodes,
    });
    this.updateuserstate("users", users);
    this.updaterolestate("roles", roles);
    console.log(this.state);
    this.refreshSelectMenuRole();
    this.refreshSelectMenuUser();
    $("#dashboardHome .permissions:eq(0) .selectpicker:eq(0)").on(
      "changed.bs.select",
      this.getExistingRolePerm
    );
    $("#dashboardHome .permissions:eq(1) .selectpicker:eq(0)").on(
      "changed.bs.select",
      this.getExistingUserPerm
    );
  }

  async componentDidUpdate() {
    $("#dashboardHome .selectpicker").selectpicker("render");
    $("#dashboardHome .dropdownRP").fadeIn(300);
    $(
      "#dashboardHome .permissions:eq(0) .dropdown:eq(0) .dropdown-menu .form-control, #dashboardHome .permissions:eq(0) .dropdown:last .dropdown-menu .form-control, #dashboardHome .permissions:eq(1) .dropdown:last .dropdown-menu .form-control"
    ).attr("placeholder", "Search Role");
    $(
      "#dashboardHome .permissions:eq(0) .dropdown:eq(1) .dropdown-menu .form-control, #dashboardHome .permissions:eq(1) .dropdown:eq(2) .dropdown-menu .form-control,#dashboardHome .permissions:eq(1) .dropdown:eq(1) .dropdown-menu .form-control, #dashboardHome .permissions:eq(0) .dropdown:eq(2) .dropdown-menu .form-control"
    ).attr("placeholder", "Search Node");
    $(
      "#dashboardHome .permissions:eq(1) .dropdown:eq(0) .dropdown-menu .form-control"
    ).attr("placeholder", "Search User");
  }

  render() {
    return (
      <div className="centeralignbox modulesettings essentials">
        <h5 className="subtitle">Admin Override</h5>
        <p className="description">
          Give administrators access to all commands
        </p>
        <div className="overrideToggle">
          <BootstrapSwitchButton
            checked={this.state.ownerOverride}
            onstyle="success"
            onlabel="ON"
            offstyle="dark"
            offlabel="OFF"
            width={80}
            onChange={async (checked) => {
              await this.toggleOverride(checked);
            }}
          />
        </div>
        <h5 className="subtitle">Role Permissions</h5>
        <p className="description">
          A hierarchical permissions system where each command has a permission
          node that can be assigned to a role to either allow or deny (negate).
          A role can also inherit permissions from another role.
          <br />
          <br />
          To add: Choose the role from the list and select appropriate nodes
          <br />
          To edit: Choose the role from the list and change accordingly
          <br />
          To remove: Choose the role and remove accordingly
          <br />
        </p>
        <div className="permissions">
          <Row>
            <div className="dropdownRP">
              <span>Select Role</span>
              <br />
              <select
                className="selectpicker"
                data-size="6"
                title="Nothing selected"
                data-live-search="true"
              >
                {Object.keys(this.state.rolePerm.roles).map((key) => (
                  <option
                    className="decorated"
                    key={this.state.rolePerm.roles[key].id}
                    value={this.state.rolePerm.roles[key].id}
                    style={{
                      color: `${
                        this.state.rolePerm.roles[key].color !== 0
                          ? `${this.getRGB(
                              this.state.rolePerm.roles[key].color
                            )}`
                          : "rgb(153, 170, 181)"
                      }`,
                      paddingLeft: "19px",
                      fontWeight: "500",
                    }}
                  >
                    {this.state.rolePerm.roles[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Perm Nodes</span>
              <br />
              <select
                className="selectpicker"
                data-width="200px"
                data-size="6"
                data-live-search="true"
                multiple
                data-selected-text-format="count"
              >
                {this.state.nodes.map((n) => (
                  <option
                    className="decorated"
                    key={n}
                    value={n}
                    style={{ color: "rgb(153, 170, 181)" }}
                  >
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Negate Nodes</span>
              <br />
              <select
                className="selectpicker"
                data-width="200px"
                data-size="6"
                data-live-search="true"
                multiple
                data-selected-text-format="count"
              >
                {this.state.nodes.map((n) => (
                  <option
                    className="decorated"
                    key={n}
                    value={n}
                    style={{ color: "rgb(153, 170, 181)" }}
                  >
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Parent Roles</span>
              <br />
              <select
                className="selectpicker"
                data-size="6"
                title="Nothing selected"
                data-live-search="true"
                multiple
              >
                {Object.keys(this.state.rolePerm.roles).map((key) => (
                  <option
                    className="decorated"
                    key={this.state.rolePerm.roles[key].id}
                    value={this.state.rolePerm.roles[key].id}
                    style={{
                      color: `${
                        this.state.rolePerm.roles[key].color !== 0
                          ? `${this.getRGB(
                              this.state.rolePerm.roles[key].color
                            )}`
                          : "rgb(153, 170, 181)"
                      }`,
                      paddingLeft: "19px",
                      fontWeight: "500",
                    }}
                  >
                    {this.state.rolePerm.roles[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="guildBtn dropdownRP"
              onClick={async () => await this.addRolePerm()}
            >
              <span href="#" className="qbtn">
                {this.state.rolePerm.addButton}
              </span>
            </div>
          </Row>
          <div id="helpertext" className="errormsg">
            {this.state.rolePerm.errormsg}
          </div>
          <div className="viewRolePermissions">
            <Table
              bordered
              hover
              striped
              size="sm"
              variant="dark"
              className="viewTable"
            >
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Permission Nodes</th>
                  <th>Negate Nodes</th>
                  <th>Parent Roles</th>
                </tr>
              </thead>
              <tbody>
                {this.state.rolePerm.permissions.length > 0 ? (
                  this.state.rolePerm.permissions.map((grp) => (
                    <tr key={grp.rid}>
                      <td
                        style={{
                          color: `${
                            grp.color !== 0
                              ? `${this.getRGB(grp.color)}`
                              : "rgb(153, 170, 181)"
                          }`,
                        }}
                      >
                        {grp.name}
                      </td>
                      <td>
                        {grp.permissions.length > 0
                          ? grp.permissions.join(", ")
                          : "None"}
                      </td>
                      <td>
                        {grp.negations.length > 0
                          ? grp.negations.join(", ")
                          : "None"}
                      </td>
                      <td>
                        {grp.parents.length > 0
                          ? grp.parents
                              .map((par, i) => <span key={i}>{par.name}</span>)
                              .reduce((prev, curr) => [prev, ", ", curr])
                          : "None"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      There are no role permissions. Add some!
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <h5 className="subtitle">User Permissions</h5>
        <p className="description">
          A hierarchical permissions system where each command has a permission
          node that can be assigned to a user to either allow or deny (negate).
          A user can also inherit permissions from another role.
          <br />
          <br />
          To add: Choose the user from the list and select appropriate nodes
          <br />
          To edit: Choose the user from the list and change accordingly
          <br />
          To remove: Choose the user and remove accordingly
          <br />
        </p>
        <div className="permissions">
          <Row>
            <div className="dropdownRP">
              <span>Select User</span>
              <br />
              <select
                className="selectpicker"
                data-size="6"
                title="Nothing selected"
                data-live-search="true"
              >
                {Object.keys(this.state.userPerm.users).map((key) => (
                  <option
                    className="decorated"
                    key={this.state.userPerm.users[key].id}
                    value={this.state.userPerm.users[key].id}
                    data-subtext={"#" + this.state.userPerm.users[key].discrim}
                    style={{
                      color: `${
                        this.state.userPerm.users[key].color !== "#000000"
                          ? this.state.userPerm.users[key].color
                          : "rgb(142, 146, 151)"
                      }`,
                      paddingLeft: "19px",
                      fontWeight: "500",
                    }}
                  >
                    {this.state.userPerm.users[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Perm Nodes</span>
              <br />
              <select
                className="selectpicker"
                data-width="200px"
                data-size="6"
                data-live-search="true"
                multiple
                data-selected-text-format="count"
              >
                {this.state.nodes.map((n) => (
                  <option
                    className="decorated"
                    key={n}
                    value={n}
                    style={{ color: "rgb(153, 170, 181)" }}
                  >
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Negate Nodes</span>
              <br />
              <select
                className="selectpicker"
                data-width="200px"
                data-size="6"
                data-live-search="true"
                multiple
                data-selected-text-format="count"
              >
                {this.state.nodes.map((n) => (
                  <option
                    className="decorated"
                    key={n}
                    value={n}
                    style={{ color: "rgb(153, 170, 181)" }}
                  >
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdownRP">
              <span>Select Parent Roles</span>
              <br />
              <select
                className="selectpicker"
                data-size="6"
                title="Nothing selected"
                data-live-search="true"
                multiple
              >
                {Object.keys(this.state.rolePerm.roles).map((key) => (
                  <option
                    className="decorated"
                    key={this.state.rolePerm.roles[key].id}
                    value={this.state.rolePerm.roles[key].id}
                    style={{
                      color: `${
                        this.state.rolePerm.roles[key].color !== 0
                          ? `${this.getRGB(
                              this.state.rolePerm.roles[key].color
                            )}`
                          : "rgb(153, 170, 181)"
                      }`,
                      paddingLeft: "19px",
                      fontWeight: "500",
                    }}
                  >
                    {this.state.rolePerm.roles[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="guildBtn dropdownRP"
              onClick={async () => await this.addUserPerm()}
            >
              <span href="#" className="qbtn">
                {this.state.userPerm.addButton}
              </span>
            </div>
          </Row>
          <div id="helpertext" className="errormsg">
            {this.state.userPerm.errormsg}
          </div>
          <div className="viewRolePermissions">
            <Table
              bordered
              hover
              striped
              size="sm"
              variant="dark"
              className="viewTable"
            >
              <thead>
                <tr>
                  <th>User</th>
                  <th>Permission Nodes</th>
                  <th>Negate Nodes</th>
                  <th>Parent Roles</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userPerm.permissions.length > 0 ? (
                  this.state.userPerm.permissions.map((grp) => (
                    <tr key={grp.uid}>
                      <td
                        style={{
                          color: `${
                            grp.color !== "#000000"
                              ? grp.color
                              : "rgb(142, 146, 151)"
                          }`,
                        }}
                      >
                        {grp.name + "#" + grp.discrim}
                      </td>
                      <td>
                        {grp.permissions.length > 0
                          ? grp.permissions.join(", ")
                          : "None"}
                      </td>
                      <td>
                        {grp.negations.length > 0
                          ? grp.negations.join(", ")
                          : "None"}
                      </td>
                      <td>
                        {grp.parents.length > 0
                          ? grp.parents
                              .map((par, i) => <span key={i}>{par.name}</span>)
                              .reduce((prev, curr) => [prev, ", ", curr])
                          : "None"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      There are no role permissions. Add some!
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <div id="helpertext">
          Need help? Join our <Link to="/support">Discord</Link>
        </div>
      </div>
    );
  }

  updateStatePermsRole = async () => {
    let roleperms = await this.props.rolepermsget(this.props.state.guild.id);
    this.updaterolestate("permissions", roleperms);
  };

  updateStatePermsUser = async () => {
    let userperms = await this.props.userpermsget(this.props.state.guild.id);
    this.updateuserstate("permissions", userperms);
  };

  getExistingRolePerm = async (e) => {
    Toast.loading("Retrieving data...");
    setTimeout(async () => {
      let role = e.target.value;
      this.updaterolestate("selectedRole", e.target.value);
      this.refreshSelectMenuRole(true);
      let res = await this.props.rolepermget(this.props.state.guild.id, role);
      Toast.hide();
      if (!res.hasprop) {
        return this.updaterolestate("addButton", "Add");
        //return this.setState({ userPerm: { addButton: "Add" } });
      }
      $(".permissions:eq(0) .selectpicker:eq(1)").selectpicker(
        "val",
        res.prop.permissions
      );
      $(".permissions:eq(0) .selectpicker:eq(2)").selectpicker(
        "val",
        res.prop.negations
      );
      $(".permissions:eq(0) .selectpicker:eq(3)").selectpicker(
        "val",
        res.prop.parents
      );
      this.updaterolestate("addButton", "Update");
      //this.setState({ userPerm: { addButton: "Update" } });
    }, 100);
  };

  getExistingUserPerm = async (e) => {
    Toast.loading("Retrieving data...");
    setTimeout(async () => {
      let user = e.target.value;
      this.updateuserstate("selectedRole", user);
      this.refreshSelectMenuUser(true);
      let res = await this.props.userpermget(this.props.state.guild.id, user);
      Toast.hide();
      if (!res.hasprop) {
        return this.updateuserstate("addButton", "Add");
        //return this.setState({ userPerm: { addButton: "Add" } });
      }
      $(".permissions:eq(1) .selectpicker:eq(1)").selectpicker(
        "val",
        res.prop.permissions
      );
      $(".permissions:eq(1) .selectpicker:eq(2)").selectpicker(
        "val",
        res.prop.negations
      );
      $(".permissions:eq(1) .selectpicker:eq(3)").selectpicker(
        "val",
        res.prop.parents
      );
      this.updateuserstate("addButton", "Update");
      //this.setState({ userPerm: { addButton: "Update" } });
    }, 100);
  };

  addRolePerm = async () => {
    $(".permissions:eq(0) .errormsg").hide();
    let role = this.state.rolePerm.selectedRole;
    let pnodes = $(".permissions:eq(0) .selectpicker:eq(1)").val();
    let nnodes = $(".permissions:eq(0) .selectpicker:eq(2)").val();
    let parents = $(".permissions:eq(0) .selectpicker:eq(3)").val();
    if (role === 0) {
      this.updaterolestate("errormsg", "First field is compulsory!");
      $(".permissions:eq(0) .errormsg").show();
    } else {
      Toast.loading("Adding...");
      setTimeout(async () => {
        let arr = [];
        arr.push(role);
        arr.push(pnodes);
        arr.push(nnodes);
        arr.push(parents);
        let res = await this.props.rolepermadd(this.props.state.guild.id, arr);
        if (res.status === 200) {
          Toast.success("New permissions added", 150);
          this.refreshSelectMenuRole();
          this.updaterolestate("selectedRole", 0);
          this.updaterolestate("addButton", "Add");
          await this.updateStatePermsRole();
        } else {
          Toast.fail("Server not responding. Please try again later", 500);
          this.props.history.push("/");
        }
      }, 500);
    }
  };

  addUserPerm = async () => {
    $(".permissions:eq(1) .errormsg").hide();
    let role = this.state.userPerm.selectedRole;
    let pnodes = $(".permissions:eq(1) .selectpicker:eq(1)").val();
    let nnodes = $(".permissions:eq(1) .selectpicker:eq(2)").val();
    let parents = $(".permissions:eq(1) .selectpicker:eq(3)").val();
    if (role === 0) {
      this.updateuserstate("errormsg", "First field is compulsory!");
      $(".permissions:eq(1) .errormsg").show();
    } else {
      Toast.loading("Adding...");
      setTimeout(async () => {
        let arr = [];
        arr.push(role);
        arr.push(pnodes);
        arr.push(nnodes);
        arr.push(parents);
        let res = await this.props.userpermadd(this.props.state.guild.id, arr);
        if (res.status === 200) {
          Toast.success("New permissions added", 150);
          this.refreshSelectMenuUser();
          this.updateuserstate("selectedRole", 0);
          this.updateuserstate("addButton", "Add");
          await this.updateStatePermsUser();
        } else {
          Toast.fail("Server not responding. Please try again later", 500);
          this.props.history.push("/");
        }
      }, 500);
    }
  };

  async toggleOverride(checked) {
    Toast.loading("Updating...");
    let res = await this.props.adminoverrideset(
      this.props.state.guild.id,
      checked
    );
    if (res.status === 200) {
      this.setState({ ownerOverride: checked });
      Toast.success("Settings Updated", 150);
    } else {
      Toast.fail("Server not responding. Please try again later", 500);
      this.props.history.push("/");
    }
  }

  refreshSelectMenuRole(bool = false) {
    let select = $(".permissions:eq(0) .selectpicker");
    if (bool) {
      select.slice(1).val("default").selectpicker("refresh");
    } else {
      select.val("default").selectpicker("refresh");
    }
  }

  refreshSelectMenuUser(bool = false) {
    let select = $(".permissions:eq(1) .selectpicker");
    if (bool) {
      select.slice(1).val("default").selectpicker("refresh");
    } else {
      select.val("default").selectpicker("refresh");
    }
  }

  getRGB(color) {
    return `rgb(${color >> 16},${(color >> 8) & 255},${color & 255})`;
  }
}

export default withRouter(ServerEssential);
