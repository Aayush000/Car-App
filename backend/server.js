const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { json } = require("express");
const app = express();

// To support cors.
app.use(cors());

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Car App.");
});

/** Create GET API. API shoudl return  const carsMockData*/
app.get("/carsList", (req, res) => {
  fs.readFile("./carsMockData.json", (err, carsList) => {
    if (err) {
      console.log(err);
    }
    const carsMockData = JSON.parse(carsList);
    res.json(carsMockData);
  });
});

/** Create POST API. Get the new car data from react.
 *      Check if car with id exists. If Yes return 500. With message 'Car already exists'
 *      If there is no car with the id, add the new car to  carsMockData and return carsMockData as response */
app.post("/save", (req, res) => {
  fs.readFile("./carsMockData.json", "utf8", (err, carsList) => {
    if (err) {
      console.log("File read failed: ", err);
    }
    let id = req.body.id;
    let brand = req.body.brand;
    let name = req.body.name;
    let releaseYear = req.body.releaseYear;
    let color = req.body.color;

    let json = JSON.parse(carsList);

    json.push({
      id: id,
      brand: brand,
      name: name,
      releaseYear: releaseYear,
      color: color,
    });
    fs.writeFile(
      "./carsMockData.json",
      JSON.stringify(json),
      (err, carsList) => {
        if (err) {
          console.log("File write Failed: ", err);
        }
      }
    );
    res.sendStatus(200);
  });
});

/** Create PUT API.
 *  Check if car with id exists. If No return 500 with error 'No car with given id exist'.
 *  If there is car with the requested id, update that car's data in 'carsMockData' and return 'carsMockData' */
app.put("/edit", (req, res) => {
  fs.readFile("./carsMockData.json", "utf8", (err, carsList) => {
    if (err) {
      console.log("File read Failed: ", err);
    }

    let id = req.body.id;

    let json = JSON.parse(carsList);

    let result = json.map((car) => {
      if (car.id == id) {
        car.brand = req.body.brand;
        car.name = req.body.name;
        car.releaseYear = req.body.releaseYear;
        car.color = req.body.color;
      }
      return car;
    });

    fs.writeFile(
      "./carsMockData.json",
      JSON.stringify(result),
      (err, carsList) => {
        if (err) {
          console.log("File write Failed: ", err);
        }
      }
    );
    res.sendStatus(200);
  });
});

/** Create Delete API.
 *  Check if car with id exists. If No return 500. With message 'No car with give id exists'
 *  If there is car with the requested id. Delete that car from 'carsMockData' and return 'carsMockData'
 */
app.delete("/delete", (req, res) => {
  fs.readFile("./carsMockData.json", "utf8", (err, carsList) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }

    let json = JSON.parse(carsList);
    let id = req.body.id;
    let result = json.filter((carDetails) => carDetails.id != id);

    fs.writeFile(
      "./carsMockData.json",
      JSON.stringify(result),
      (err, carsList) => {
        if (err) {
          console.log("File write failed:", err);
          return;
        }
      }
    );
    res.sendStatus(200);
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
