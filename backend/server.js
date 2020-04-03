const express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  mysql = require("mysql"),
  conf = require("./config.json"),
  MySQLStore = require("connect-mysql")(session),
  { Strategy } = require("passport-discord"),
  cors = require("cors"),
  app = express();

var connection = mysql.createConnection({
  host: conf.config.host,
  user: conf.config.username,
  password: conf.config.password,
  database: conf.config.database
});
connection.connect(function(err) {
  if (err) {
    return console.log(err);
  } else {
    console.log("Connection established to mysql server");
  }
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ["identify", "guilds"];

passport.use(
  new Strategy(
    {
      clientID: "303533323257643020",
      clientSecret: "ChD4WBE8cvkyAs841mKjpjZwiOfUqP1x",
      callbackURL: "http://localhost:5000/discord-callback",
      scope: scopes
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret: "woahthisissickwhatdoIputhere ?!?!?",
    store: new MySQLStore(conf),
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login",
  cors(),
  passport.authenticate("discord", { scope: scopes }),
  function(req, res) {}
);

app.get(
  "/discord-callback",
  cors(),
  passport.authenticate("discord", { failureRedirect: "/" }),
  function(req, res) {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.get("/auth/check", function(req, res) {
  res.send(req.isAuthenticated());
});

app.get("/auth/logout", function(req, res) {
  req.logout();
  res.send("User Logged Out!");
});

app.get("/auth/user", checkAuth, function(req, res) {
  res.send([req.user.username, req.user.id, req.user.avatar]);
});

app.get("/auth/guilds", checkAuth, function(req, res) {
  res.json(req.user.guilds);
});

app.get("/auth/guildissetup", function(req, res) {
  if (!req.query.id || req.query.id.length != 18) {
    return res.status(401).send({ error: "No query found!" });
  }
  let gid = req.query.id;
  connection.query("SELECT * FROM `servers` WHERE `ID`=" + gid, function(
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

app.get("/auth/modules", function(req, res) {
  if (!req.query.id || req.query.id.length != 18) {
    return res.status(401).send({ error: "No query found" });
  }
  let gid = req.query.id;
  let active,
    all,
    resp = {};
  connection.query(
    "SELECT activeModules FROM `servers` WHERE `ID`=" + gid,
    function(err, row) {
      if (err) {
        res.send({ error: "MySql Query Error:" });
        return console.log(err);
      } else {
        if (row.length != 1) {
          res.send({ error: "No Guild Found" });
        } else {
          active = row[0].activeModules.split(", ");
          connection.query("SELECT modules FROM `quika_data`", function(
            err,
            row
          ) {
            if (err) {
              res.send({ error: "MySql Query Error:" });
              return console.log(err);
            } else {
              if (row.length != 1) {
                console.log("Quika Data Row Not Found!");
                res.send({ error: "Existing Modules List not found!" });
              } else {
                all = row[0].modules.split(", ");
                if (!all || all.length < 1) return;
                if (!active || active.length < 1) return;
                for (let i = 0; i < all.length; i++) {
                  if (active.indexOf(all[i].toLowerCase()) > -1) {
                    resp[all[i]] = true;
                  } else {
                    resp[all[i]] = false;
                  }
                }
                res.json(resp);
              }
            }
          });
        }
      }
    }
  );
});

app.get("/auth/setmodule", function(req, res) {
  if (
    !req.query.mod ||
    !req.query.gid ||
    req.query.gid.length != 18
  ) {
    return res.sendStatus(404);
  }
  let module = req.query.mod,
    gid = req.query.gid,
    add = JSON.parse(req.query.add);
  connection.query(
    "SELECT activeModules FROM `servers` WHERE `ID`=" + gid,
    function(err, row) {
      if (err) {
        res.sendStatus(404);
        return console.log(err);
      } else {
        if (row.length != 1) {
          res.sendStatus(404);
        } else {
          let active = row[0].activeModules.split(", ");
          if (add) {
            if (active.indexOf(module) > -1) return res.sendStatus(200);
            active.push(module);
          }
          if (!add) {
            if (active.indexOf(module) <= -1) return res.sendStatus(200);
            active.splice(active.indexOf(module), 1);
          }
          let modules = active.join(", ");
          connection.query(
            "UPDATE `servers` SET `activeModules`='" +
              modules +
              "' WHERE `ID`=" +
              gid,
            function(err, row) {
              if (err) {
                res.sendStatus(404);
                return console.log(err);
              } else {
                res.sendStatus(200);
              }
            }
          );
        }
      }
    }
  );
});

app.get("/test", cors(), function(req, res) {
  res.send("Test recieved");
});

app.get("/info", cors(), checkAuth, function(req, res) {
  res.json(req.user);
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.send("User not logged in...");
}

app.listen("5000", function(err) {
  if (err) return console.log(err);
  console.log("Listening at port 5000");
});
