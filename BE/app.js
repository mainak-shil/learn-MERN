const fs = require("fs");

const userName = "Mainak";

fs.writeFile("user-data.txt", "Name: " + userName, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("WRITE FILE");
});
