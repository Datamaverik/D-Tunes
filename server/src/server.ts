import env from "./utils/validateEnv";
import mongoose from "mongoose";
import app from "./app";

const connectionString = env.MONGO_URI;
const port = env.PORT;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("Server running on port: " + port);
    });
  })
  .catch((err) => {
    console.error("Something went wrong! Couldn't connect to mongoose");
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello, DTunes!");
});
