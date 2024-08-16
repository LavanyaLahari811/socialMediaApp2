const express = require("express");
const mysql = require("mysql2/promise");
const mysqlPool = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const userRouter=require("./routes/users");
const verificationRouter=require("./routes/web");

app.use("/main",userRouter);
app.use("/main",verificationRouter);


const port = process.env.port || 8000;

mysqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("mysql connected");

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
