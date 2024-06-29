const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

const sensorId = "66740990604ad47aa6e6cbc6";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcmVrQGdtYWlsLmNvbSIsImlkIjoiNjY3NDA1ZWViM2M0ZjQxMzA4NDYwYjQ4Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzE4ODgxODI5LCJleHAiOjE3MTg4OTI2Mjl9.O2ZJmix-8PhT5pYpx3IXxUl-UprZsZYMlS6UQsk1duE";

const baseURL = "http://localhost:4000/api";

const getLast100Readings = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/sensorReadings/${sensorId}/last100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.readings;
  } catch (error) {
    console.error(
      "Error fetching readings:",
      error.response ? error.response.data : error.message
    );
  }
};

const exportToCSV = async (readings) => {
  const csvWriter = createCsvWriter({
    path: "sensor_readings.csv",
    header: [
      { id: "timestamp", title: "Timestamp" },
      { id: "value", title: "Value" },
    ],
  });

  const records = readings.map((reading) => ({
    timestamp: new Date(reading.t * 1000).toISOString(), // Convert to ISO date format
    value: reading.v,
  }));

  try {
    await csvWriter.writeRecords(records);
    console.log("CSV file written successfully");
  } catch (error) {
    console.error("Error writing CSV file:", error.message);
  }
};

const exportReadings = async () => {
  const readings = await getLast100Readings();
  if (readings && readings.length > 0) {
    await exportToCSV(readings);
  } else {
    console.log("No readings found to export");
  }
};

exportReadings();
