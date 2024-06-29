const axios = require("axios");

const sensorId = "66757c879087f55851cfe033";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcmVrQGV4YW1wbGUuY29tIiwiaWQiOiI2Njc1NzdhOTkwODdmNTU4NTFjZmUwMGQiLCJyb2xlIjoiT1BFUkFUSU9OIiwiaWF0IjoxNzE5NjY0Njg3LCJleHAiOjE3MTk2ODYyODd9.bWjxntE596R_ErxdVQeSiOer8gv-dY4fsrphNVRCcts";

const baseURL = "http://localhost:4000/api";

const initialTimestamp = 1718879726;
const increment = 30 * 60; // 30 minutes in seconds
const numberOfReadings = 100;
const meanValue = 293;
const standardDeviation = 5; // Assuming standard deviation for normal distribution
var previousValue = 293;

// Function to generate normally distributed random numbers
function randomNormal(mean, stdDev, previousValue) {
  let u1 = 0,
    u2 = 0;
  while (u1 === 0) u1 = Math.random(); // Convert [0,1) to (0,1)
  while (u2 === 0) u2 = Math.random(); // Convert [0,1) to (0,1)
  const randStdNormal =
    Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); // Random normal(0,1)
  // console.log(randStdNormal);
  const randomValue = mean + stdDev * randStdNormal; // Random normal(mean,stdDev)
  // console.log(randomValue);
  // Smooth the data by averaging the previous value with the new random value
  const smoothValue = previousValue + (randomValue - previousValue) * 0.5;
  console.log(smoothValue);
  previousValue = smoothValue;
  return smoothValue;
}

const generateReading = (timestamp) => {
  var entry = {
    bn: "temperature",
    bv: meanValue,
    n: "nozzle temperature",
    u: "C",
    v: Math.round(randomNormal(meanValue, standardDeviation, previousValue)), // Generate a normally distributed value and round it
    s: "s_value",
    t: timestamp,
  };
  // console.log(entry);
  return entry;
};

const addReading = async (reading) => {
  try {
    const response = await axios.post(
      `${baseURL}/sensorReadings/${sensorId}`,
      reading,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding reading:",
      error.response ? error.response.data : error.message
    );
  }
};

const populateReadings = async () => {
  let timestamp = initialTimestamp;

  for (let i = 0; i < numberOfReadings; i++) {
    const reading = generateReading(timestamp);
    await addReading(reading);
    timestamp += increment;
  }

  console.log("Database populated with sensor readings");
};

populateReadings();
