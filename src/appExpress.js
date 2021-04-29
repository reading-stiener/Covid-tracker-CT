const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { queryBQ, stateQuery, countyQuery, countyAgg } = require("./BigQueryClient");

const app = express();
const port = 3000;

// confifuring middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/test_template.html");
});

app.post("/", (req, res) => { 
    console.log(req.body); 
    res.send("received your request!!");
});

app.get("/covidgendata", async (req, res) => {
    var level = req.query.type;
    console.log(level);
    try {
        if (level == "state") { 
            const covidData = await queryBQ(stateQuery);
            res.json(covidData);
        } else if (level == "county") { 
            const covidData = await queryBQ(countyQuery);
            res.json(covidData);
        } else if (level == "countyAgg") { 
            const covidData = await queryBQ(countyAgg)
            res.json(covidData);
        } 
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
});

app.listen(port, () => {
    console.log("Server is running on localhost 3000");
});