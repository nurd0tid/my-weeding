const fs = require("fs");
const path = require("path");

const dataPath = path.resolve(__dirname, "data.json");

exports.handler = async function (event, context) {
  if (event.httpMethod === "POST") {
    let jsonData = [];
    const newEntry = JSON.parse(event.body);

    try {
      const fileData = fs.readFileSync(dataPath, "utf8");
      if (fileData) {
        jsonData = JSON.parse(fileData);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        // File tidak ada, buat file baru
        fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
        };
      }
    }

    // Tambahkan data baru
    jsonData.push(newEntry);

    // Tulis kembali ke file
    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data submitted successfully" }),
    };
  }

  if (event.httpMethod === "GET") {
    let jsonData = [];
    try {
      const fileData = fs.readFileSync(dataPath, "utf8");
      if (fileData) {
        jsonData = JSON.parse(fileData);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        // File tidak ada, buat file baru
        fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
        };
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(jsonData),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
  };
};
