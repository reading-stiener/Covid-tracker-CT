const express = require("express"); 
const app = express();

app.use("/", express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/test_template.html");
});

app.listen(3000, () => {
    console.log("Server is running on localhost 3000");
});