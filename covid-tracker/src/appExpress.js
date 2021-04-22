const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { queryBQ } = require("./BigQueryClient");

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

app.get("/covidgendata", async (req, res) => {
    try {
        // const body = req.body;
        // console.log(body);
        const params = req.params; 
        console.log(params.city);
        const covidData = await queryBQ();
        res.json(covidData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: error });
    }
})

app.listen(port, () => {
    console.log("Server is running on localhost 3000");
});