const express = require("express");
const { connection } = require("./config/db")
const { postRoute } = require("./Router/postRoute")
const { getRouter } = require("./Router/getRouter")
const { authMiddleware } = require("./middleware/auth")
const https = require("https")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/user", postRoute);
app.use("/data", getRouter);

app.get("/",authMiddleware ,(req, res) => {
    res.send("done");
    res.sendFile(__dirname + "/index.html")

})

app.post("/", async (req, res) => {
    try {
        const query = req.body.city
        const apiKey = "543acf1f86c8c95a00bc6485a65fdcdb"
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey

        https.get(url, (response) => {
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                console.log(weatherData)
                const temp = weatherData.main.temp;
                const discription = weatherData.weather[0].description

                res.send(`The temperature in ${query} is ${temp} degree celcius \n And weather desciption are ${discription}`)
            })
        })

    } catch (err) {
        res.send(err.message);

    }

})



app.listen(3030, async () => {
    try {
        await connection;
        console.log("running");

    } catch (err) {
        console.log(err.message);

    }

})