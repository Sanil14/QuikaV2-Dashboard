const express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  mysql = require("mysql"),
  MySQLStore = require("connect-mysql")(session),
  { Strategy } = require("passport-discord"),
  cors = require("cors"),
  app = express(),
  fetch = require("node-fetch"),
  Discord = require("discord.js"),
  quika = new Discord.Client(),
  path = require("path"),
  conf = {
    config: {
      host: process.env.HOST,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      bottoken: process.env.BOT_TOKEN,
    },
  };

// DISCORD BOT LOGIN AND CONFIG
quika.on("ready", () => {
  console.log("Discord Bot Initialized");
});
quika.login(conf.config.bottoken);

// Express and OAUTH

var connection = mysql.createConnection({
  host: conf.config.host,
  user: conf.config.user,
  password: conf.config.password,
  database: conf.config.database,
});
connection.connect(function (err) {
  if (err) {
    return console.log(err);
  } else {
    console.log("Connection established to mysql server");
  }
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

var scopes = ["identify", "guilds"];

passport.use(
  new Strategy(
    {
      clientID: "303533323257643020",
      clientSecret: "ChD4WBE8cvkyAs841mKjpjZwiOfUqP1x",
      callbackURL:
        "http://quikabot.com/discord-callback",
      scope: scopes,
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "woahthisissickwhatdoIputhere ?!?!?",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("../frontend/build"));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "/index.html"));
});

app.get(
  "/login",
  cors(),
  passport.authenticate("discord", { scope: scopes }),
  function (req, res) {}
);

app.get(
  "/discord-callback",
  cors(),
  passport.authenticate("discord", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("./dashboard");
  }
);

app.get("/auth/check", function (req, res) {
  let authed = req.isAuthenticated();
  return res.send(authed);
});

app.get("/auth/logout", function (req, res) {
  req.logout();
  return res.send("User Logged Out!");
});

app.get("/auth/user", checkAuth, function (req, res) {
  return res.send([req.user.username, req.user.id, req.user.avatar]);
});

app.get("/auth/guilds", checkAuth, function (req, res) {
  return res.json(req.user.guilds);
});

app.get("/auth/guildissetup", function (req, res) {
  if (!req.query.id || req.query.id.length != 18) {
    return res.status(401).send({ error: "No query found!" });
  }
  let gid = req.query.id;
  connection.query("SELECT * FROM `servers` WHERE `ID`=" + gid, function (
    err,
    row
  ) {
    if (err) {
      res.status(401).send({ error: "MySql Query Error:" });
      return console.log(err);
    } else {
      if (row.length == 1) {
        return res.send(true);
      } else {
        return res.send(false);
      }
    }
  });
});

app.get("/auth/guildcheck", function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) {
    return res.status(401).send({ error: "No query found!" });
  }
  let gid = req.query.gid,
    userid = req.user.id;
  if (!quika.guilds.cache.some((u) => u.id === gid))
    return res.json({ code: 401 });
  if (
    !quika.guilds.cache.get(gid).members.cache.some((u) => u.user.id === userid)
  )
    return res.json({ code: 401 });
  let mem = quika.guilds.cache.get(gid).members.cache.get(userid);
  if (
    mem.hasPermission("ADMINISTRATOR") ||
    quika.guilds.cache.get(gid).ownerID === userid
  ) {
    let resp = {};
    resp.id = gid;
    resp.name = quika.guilds.cache.get(gid).name;
    resp.icon = quika.guilds.cache.get(gid).icon;
    return res.json(resp);
  }
});

app.get("/auth/modules", checkAuth, function (req, res) {
  if (!req.query.id || req.query.id.length != 18) {
    return res.status(401).send({ error: "No query found" });
  }
  let gid = req.query.id;
  let active,
    all,
    resp = {};
  connection.query(
    "SELECT activeModules FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          return res.send({ error: "No Guild Found" });
        } else {
          active = JSON.parse(row[0].activeModules);
          connection.query("SELECT modules FROM `quika_data`", function (
            err,
            row
          ) {
            if (err) {
              res.send({ error: "MySql Query Error:" });
              return console.log(err);
            } else {
              if (row.length != 1) {
                console.log("Quika Data Row Not Found!");
                return res.send({ error: "Existing Modules List not found!" });
              } else {
                all = Object.keys(JSON.parse(row[0].modules));
                if (!all || all.length < 1) return;
                if (!active || active.length < 1) return;
                for (let i = 0; i < all.length; i++) {
                  resp[all[i]] = {};
                  if (active.indexOf(all[i].toLowerCase()) > -1) {
                    resp[all[i]].enabled = true;
                    resp[all[i]].desc = Object.values(
                      JSON.parse(row[0].modules)
                    )[i];
                  } else {
                    resp[all[i]].enabled = false;
                    resp[all[i]].desc = Object.values(
                      JSON.parse(row[0].modules)
                    )[i];
                  }
                }
                return res.json(resp);
              }
            }
          });
        }
      }
    }
  );
});

app.get("/auth/setmodule", checkAuth, function (req, res) {
  if (!req.query.mod || !req.query.gid || req.query.gid.length != 18) {
    return res.sendStatus(404);
  }
  let module = req.query.mod,
    gid = req.query.gid,
    add = JSON.parse(req.query.add);
  connection.query(
    "SELECT activeModules FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.sendStatus(404);
        return console.log(err);
      } else {
        if (row.length != 1) {
          return res.sendStatus(404);
        } else {
          let active = JSON.parse(row[0].activeModules);
          if (add) {
            if (active.indexOf(module) > -1) return res.sendStatus(200);
            active.push(module);
          }
          if (!add) {
            if (active.indexOf(module) <= -1) return res.sendStatus(200);
            active.splice(active.indexOf(module), 1);
          }
          let modules = JSON.stringify(active);
          connection.query(
            "UPDATE `servers` SET `activeModules`='" +
              modules +
              "' WHERE `ID`=" +
              gid,
            function (err, row) {
              if (err) {
                res.sendStatus(404);
                return console.log(err);
              } else {
                return res.sendStatus(200);
              }
            }
          );
        }
      }
    }
  );
});

app.get("/auth/getoverride", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) {
    return res.status(401).send({ error: "No query found" });
  }
  let { gid } = req.query;
  connection.query(
    "SELECT adminOverride FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySQL Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          return res.send({ error: "No Guild Found" });
        } else {
          let toggle = row[0].adminOverride;
          return res.json(toggle);
        }
      }
    }
  );
});

app.get("/auth/setoverride", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) return res.sendStatus(404);
  let { gid } = req.query,
    toggle = JSON.parse(req.query.toggle);
  connection.query(
    "UPDATE `servers` SET `adminOverride`=" + toggle + " WHERE `ID`=" + gid,
    async function (err, row) {
      if (err) {
        res.sendStatus(404);
        return console.log(err);
      } else {
        return res.sendStatus(200);
      }
    }
  );
});

app.get("/auth/getgroles", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) return res.sendStatus(404);
  let gid = req.query.gid;
  if (!quika.guilds.cache.some((u) => u.id === gid)) return res.sendStatus(404);
  let roles = [];
  quika.guilds.cache.get(gid).roles.cache.map((r, i) => {
    if (r.managed) return;
    roles.push({
      name: r.name,
      rawPosition: r.rawPosition,
      color: r.color,
      id: i,
    });
  });
  return res.json(roles);
});

app.get("/auth/getnodes", checkAuth, function (req, res) {
  connection.query("SELECT perm_nodes FROM `quika_data`", function (err, row) {
    if (err) {
      res.send({ error: "MySql Query Error:" });
      return console.log(err);
    } else {
      if (row.length != 1) {
        console.log("Quika Data Row Not Found!");
        return res.send({ error: "Existing Quika Nodes not found!" });
      } else {
        nodes = JSON.parse(row[0].perm_nodes);
        return res.json(nodes);
      }
    }
  });
});

app.get("/auth/getusers", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) return res.sendStatus(404);
  let gid = req.query.gid;
  if (!quika.guilds.cache.some((u) => u.id === gid)) return res.sendStatus(404);
  let users = [];
  quika.guilds.cache.get(gid).members.cache.map((r, i) => {
    if (r.id === quika.guilds.cache.get(gid).ownerID) return;
    users.push({
      name: r.user.username,
      discrim: r.user.discriminator,
      color: r.displayHexColor,
      id: i,
    });
  });
  return res.json(users);
});

app.get("/auth/addroleperm", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18 || !req.query.perm)
    return res.sendStatus(404);
  let gid = req.query.gid,
    perms = req.query.perm;
  connection.query(
    "SELECT rolePermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].rolePermission
            ? JSON.parse(row[0].rolePermission)
            : {};
          //if (obj.hasOwnProperty(perms[0])) return res.sendStatus(202); // Unauthorized
          obj[perms[0]] = {};
          obj[perms[0]].permissions = JSON.parse(perms[1]);
          obj[perms[0]].negations = JSON.parse(perms[2]);
          obj[perms[0]].parents = JSON.parse(perms[3]);
          connection.query(
            "UPDATE `servers` SET `rolePermission`='" +
              JSON.stringify(obj) +
              "' WHERE `ID`=" +
              gid,
            async function (err, row) {
              if (err) {
                res.sendStatus(404);
                return console.log(err);
              } else {
                return res.sendStatus(200);
              }
            }
          );
        }
      }
    }
  );
});

app.get("/auth/getroleperm", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18 || !req.query.rid)
    return res.sendStatus(404);
  let gid = req.query.gid,
    rid = req.query.rid;
  connection.query(
    "SELECT rolePermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].rolePermission
              ? JSON.parse(row[0].rolePermission)
              : {},
            resp = {};
          resp.hasprop = false;
          resp.prop = {};
          if (obj.hasOwnProperty(rid)) {
            resp.hasprop = true;
            resp.prop = obj[rid];
          }
          return res.json(resp);
        }
      }
    }
  );
});

app.get("/auth/getroleperms", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) return res.sendStatus(404);
  let gid = req.query.gid;
  connection.query(
    "SELECT rolePermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].rolePermission
              ? JSON.parse(row[0].rolePermission)
              : {},
            resp = [];
          if (Object.keys(obj).length < 1) return res.json([]);
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              let rname = quika.guilds.cache.get(gid).roles.cache.get(key).name;
              let rcolor = quika.guilds.cache.get(gid).roles.cache.get(key)
                .color;
              let par = [];
              obj[key].parents.forEach((p) => {
                let prname = quika.guilds.cache.get(gid).roles.cache.get(p)
                  .name;
                par.push({
                  name: prname,
                });
              });
              resp.push({
                rid: key,
                name: rname,
                color: rcolor,
                permissions: obj[key].permissions,
                negations: obj[key].negations,
                parents: par,
              });
            }
          }
          return res.json(resp);
        }
      }
    }
  );
});

app.get("/auth/adduserperm", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18 || !req.query.perm)
    return res.sendStatus(404);
  let gid = req.query.gid,
    perms = req.query.perm;
  connection.query(
    "SELECT userPermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].userPermission
            ? JSON.parse(row[0].userPermission)
            : {};
          obj[perms[0]] = {};
          obj[perms[0]].permissions = JSON.parse(perms[1]);
          obj[perms[0]].negations = JSON.parse(perms[2]);
          obj[perms[0]].parents = JSON.parse(perms[3]);
          connection.query(
            "UPDATE `servers` SET `userPermission`='" +
              JSON.stringify(obj) +
              "' WHERE `ID`=" +
              gid,
            async function (err, row) {
              if (err) {
                res.sendStatus(404);
                return console.log(err);
              } else {
                return res.sendStatus(200);
              }
            }
          );
        }
      }
    }
  );
});

app.get("/auth/getuserperm", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18 || !req.query.uid)
    return res.sendStatus(404);
  let gid = req.query.gid,
    uid = req.query.uid;
  connection.query(
    "SELECT userPermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].userPermission
              ? JSON.parse(row[0].userPermission)
              : {},
            resp = {};
          resp.hasprop = false;
          resp.prop = {};
          if (obj.hasOwnProperty(uid)) {
            resp.hasprop = true;
            resp.prop = obj[uid];
          }
          return res.json(resp);
        }
      }
    }
  );
});

app.get("/auth/getuserperms", checkAuth, function (req, res) {
  if (!req.query.gid || req.query.gid.length != 18) return res.sendStatus(404);
  let gid = req.query.gid;
  connection.query(
    "SELECT userPermission FROM `servers` WHERE `ID`=" + gid,
    function (err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          console.log("Quika Data Row Not Found!");
          return res.send({ error: "Existing Quika Nodes not found!" });
        } else {
          let obj = row[0].userPermission
              ? JSON.parse(row[0].userPermission)
              : {},
            resp = [];
          if (Object.keys(obj).length < 1) return res.json([]);
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              let uname = quika.guilds.cache.get(gid).members.cache.get(key)
                .user.username;
              let discrim = quika.guilds.cache.get(gid).members.cache.get(key)
                .user.discriminator;
              let color = quika.guilds.cache.get(gid).members.cache.get(key)
                .displayHexColor;
              let par = [];
              obj[key].parents.forEach((p) => {
                let prname = quika.guilds.cache.get(gid).roles.cache.get(p)
                  .name;
                par.push({
                  name: prname,
                });
              });
              resp.push({
                uid: key,
                name: uname,
                discrim: discrim,
                color: color,
                permissions: obj[key].permissions,
                negations: obj[key].negations,
                parents: par,
              });
            }
          }
          return res.json(resp);
        }
      }
    }
  );
});

app.get("/test", cors(), function (req, res) {
  return res.send("Test recieved");
});

app.get("/info", cors(), checkAuth, function (req, res) {
  return res.json(req.user);
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.send("User not logged in...");
}

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "/index.html"));
});

app.listen("5000", function (err) {
  if (err) return console.log(err);
  console.log("Listening at port 5000");
});
