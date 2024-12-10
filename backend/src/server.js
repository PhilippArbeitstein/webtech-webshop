let express = require("express");
let cors = require("cors");
const app = express();

app.use(express.static("public"));
app.use(cors());

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const dbPool = require("./pool.js");

//Allow parsing JSON Bodies in Requests
let bodyParser = require("body-parser");
app.use(bodyParser.json());

const checkAuth = require("./auth/auth.js");

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            pool: dbPool,
            tableName: "user_sessions",
            createTableIfMissing: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60, // 1 Stunde bis der Cookie expired
        },
        secret: "SomeVeryVerySecretSecret",
    })
);

const loginRoutes = require("./auth/login.js");
app.use("/login", loginRoutes);

const realEstateRoutes = require("./real_estate/real_estate.js");
app.use("/real_estate", realEstateRoutes);

const retailRoutes = require("./retail/retail.js");
app.use("/retail", retailRoutes);

const vehicleRoutes = require("./vehicles/vehicles.js");
app.use("/vehicles", vehicleRoutes);

app.get("/logout", checkAuth, (req, res) => {
    req.session.destroy();
    if (req.session) {
        res.status(500).json({ error: "Error logging out." });
    } else {
        res.status(200).json({ message: "Succesfully logged out." });
    }
});

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:" + port);
