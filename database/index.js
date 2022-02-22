const mongoose = require("mongoose");

import { Secrets } from "../config"


const connection = mongoose.connect(Secrets.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("Connect Successful"))
  .catch((err) => console.error("Could not connect" + err));

export default connection;
