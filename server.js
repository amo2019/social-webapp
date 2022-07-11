const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("./service-worker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "service-worker.js"));
  });

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Express server is running on port: ${PORT}`)
);