require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const connectToDb = require('./db')
const cookieParser = require('cookie-parser')
var cors = require("cors")


// middleware
app.use(express.json())
app.use(cookieParser())


app.use(cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 204,
  credentials: true
}
))


app.use("/api/auth", require("./routes/auth"))
app.use("/api/note", require("./routes/note"))



app.listen(port, () => {
  connectToDb()
  console.log(`Server is running on port ${port}`);
});