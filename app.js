const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https'); //to send requests to internet/remote apis we need to use this https lib.

const app = express();

app.use(express.static("public"));
//static used so that the server can access the public folder which contains the css and png files.
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/afc4284867";

  const options = {
    method: "POST",
    auth: "shabnam1:e45ad653b4b2235e7e5b1487c355237b-us11"
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData); //running the jsonData on the request variable created above
  request.end(); //must end the api calls made to external apis to avoid any issues later on.
});

app.listen(3000, function () {
  console.log("Newsletter Server is running on port 3000.");
});

//e45ad653b4b2235e7e5b1487c355237b-us11
// afc4284867
