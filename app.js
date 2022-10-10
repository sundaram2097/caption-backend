const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const dbconnect = require("./shared/db_integration");
const userRouter = require("./routes/userRoute");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  //simple logger to find all accessed paths
  console.log("called " + req.url + " by " + req.ip);
  next();
});

app.use("/user", userRouter);

dbconnect()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server Running Successfully");
    });
  })
  .catch((e) => console.log(e));
