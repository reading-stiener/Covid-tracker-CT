const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  queryBQ,
  stateQuery,
  countyQuery,
  countyAgg,
} = require("./BigQueryClient");

const app = express();
// const port = 3000;

// setting up templating engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// confifuring middlewares
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use("/", express.static(__dirname));

app.get("/", (req, res) => {
  res.render("index", {metric: "new_confirmed"});
});

app.post("/", (req, res) => {
  const body = req.body;
  if (body && body.metric) {
    res.render("index", {metric: body.metric});
  } else {
    res.render("index", {metric: "new_confirmed"});
  }
});

app.get("/covidgendata", async (req, res) => {
  const level = req.query.type;
  console.log(level);
  try {
    if (level == "state") {
      const covidData = await queryBQ(stateQuery);
      res.json(covidData);
    } else if (level == "county") {
      const covidData = await queryBQ(countyQuery);
      res.json(covidData);
    } else if (level == "countyAgg") {
      const covidData = await queryBQ(countyAgg);
      res.json(covidData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, error: error});
  }
});

// app.listen(port, () => {
//     console.log("Server is running on localhost 3000");
// });

exports.app = functions.https.onRequest(app);
