const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDb Connected Successfully");
  })
  .catch((err) => {
    console.log(err, "MongoDB failed to connect ");
  });
