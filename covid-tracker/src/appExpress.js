const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { queryBQ } = require("./BigQueryClient");

const app = express();
const port = 3000;

// confifuring middlewares
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/test_template.html");
});

app.get("/covidgendata", async (req, res) => {
    try {
        // const params = req.params; ß
        // console.log(params.city);
        const covidData = await queryBQ();
        const testData = [
            {
                "province_state": "Connecticut",
                "country_region": "United States of America",
                "date": {
                    "value": "2020-01-31"
                },
                "latitude": 41.6,
                "longitude": -72.7,
                "state": "Connecticut",
                "county": null,
                "location_geom": {
                    "value": "POINT(-72.7 41.6)"
                },
                "confirmed": 0,
                "deaths": 0,
                "recovered": null,
                "active": null,
                "fips": null,
                "combined_key": "US_CT"
            },
            {
                "province_state": "Connecticut",
                "country_region": "United States of America",
                "date": {
                    "value": "2020-02-20"
                },
                "latitude": 41.6,
                "longitude": -72.7,
                "state": "Connecticut",
                "county": null,
                "location_geom": {
                    "value": "POINT(-72.7 41.6)"
                },
                "confirmed": 0,
                "deaths": 0,
                "recovered": null,
                "active": null,
                "fips": null,
                "combined_key": "US_CT"
            },
            {
                "province_state": "Connecticut",
                "country_region": "United States of America",
                "date": {
                    "value": "2021-04-16"
                },
                "latitude": 41.6,
                "longitude": -72.7,
                "state": "Connecticut",
                "county": null,
                "location_geom": {
                    "value": "POINT(-72.7 41.6)"
                },
                "confirmed": 327956,
                "deaths": 7986,
                "recovered": null,
                "active": null,
                "fips": null,
                "combined_key": "US_CT"
            },
            {
                "province_state": "Connecticut",
                "country_region": "United States of America",
                "date": {
                    "value": "2020-03-20"
                },
                "latitude": 41.6,
                "longitude": -72.7,
                "state": "Connecticut",
                "county": null,
                "location_geom": {
                    "value": "POINT(-72.7 41.6)"
                },
                "confirmed": 194,
                "deaths": 3,
                "recovered": null,
                "active": null,
                "fips": null,
                "combined_key": "US_CT"
            }
        ]
        res.json(testData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
})

app.listen(port, () => {
    console.log("Server is running on localhost 3000");
});