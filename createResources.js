const axios = require("axios");
require("dotenv").config();

const baseURL = process.env.BASE_URL || "http://localhost:4000/api";
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5YUBleGFtcGxlLmNvbSIsImlkIjoiNjY2OTZiYjc5MzIxOGI0MjYzZGZiNmQ5Iiwicm9sZSI6Ik9QRVJBVElPTiIsImlhdCI6MTcxODY3NTg2NSwiZXhwIjoxNzE4Njc3NjY1fQ.Q_TMvRudvhvkwEt9iCqain20_YeCbC_EbNCu4f0S6SA"; // Replace with your admin token

const users = [
  {
    firstName: "Ammar",
    lastName: "Akkram",
    email: "ammar@fms.com",
    password: "12345678",
    role: "ADMIN",
  },
  {
    firstName: "Tarek",
    lastName: "Ragab",
    email: "tarek@fms.com",
    password: "12345678",
    role: "ADMIN",
  },
];

let tokens = {};
const factoryIds = [];
const assetIds = [];
const sensorIds = [];

const factories = [{ name: "PAFT" }, { name: "PLASTICO" }];

const assets = [
  { name: "V-Cola", type: "Production Line 1" },
  { name: "Big Cola", type: "Production Line 2" },
];

const sensors = [
  { name: "Nozzle", type: "Temperature" },
  { name: "Mold", type: "Temperature" },
  { name: "Volt", type: "Operating Voltage" },
  { name: "Pressure", type: "Air Pressure" },
];

const readings = [
  {
    v: 290,
    bv: 293,
    u: "C",
    t: 1718889726,
  },
];

async function registerUser(user) {
  const response = await axios.post(`${baseURL}/users/register`, user);
  return response.data.data.user;
}

async function loginUser(user) {
  const response = await axios.post(`${baseURL}/users/login`, {
    email: user.email,
    password: user.password,
  });
  return response.data.data.token;
}

async function createFactory(factory, token) {
  const response = await axios.post(`${baseURL}/factories`, factory, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.factory;
}

async function createAsset(asset, factoryId, token) {
  const response = await axios.post(
    `${baseURL}/assets`,
    { ...asset, factoryId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.asset;
}

async function createSensor(sensor, assetId, token) {
  const response = await axios.post(
    `${baseURL}/sensors`,
    { ...sensor, assetId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.sensor;
}

async function addReading(sensorId, reading, token) {
  const response = await axios.post(
    `${baseURL}/sensorReadings/${sensorId}`,
    reading,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.reading;
}

async function createResources() {
  try {
    // Register users
    for (const user of users) {
      try {
        // await registerUser(user);
        const token = await loginUser(user);
        tokens[user.email] = token;
      } catch (error) {
        console.error(
          `Error registering or logging in user ${user.email}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
    console.log(tokens);

    // Create factories
    for (const factory of factories) {
      try {
        const factoryData = await createFactory(
          factory,
          tokens[users[0].email]
        );
        factoryIds.push(factoryData._id);
      } catch (error) {
        console.error(
          `Error creating factory ${factory.name}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
    console.log(factoryIds);

    // Create assets and associate with factories
    for (let i = 0; i < assets.length; i++) {
      try {
        const asset = assets[i];
        const factoryId = factoryIds[i % factoryIds.length];
        const assetData = await createAsset(
          asset,
          factoryId,
          tokens[users[0].email]
        );
        assetIds.push(assetData._id);
      } catch (error) {
        console.error(
          `Error creating asset ${assets[i].name}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
    console.log(assetIds);

    // Create sensors and associate with assets
    for (let i = 0; i < sensors.length; i++) {
      try {
        const sensor = sensors[i];
        const assetId = assetIds[i % assetIds.length];
        const sensorData = await createSensor(
          sensor,
          assetId,
          tokens[users[0].email]
        );
        sensorIds.push(sensorData._id);
      } catch (error) {
        console.error(
          `Error creating sensor ${sensors[i].name}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
    console.log(sensorIds);

    console.log("Database populated successfully");
  } catch (error) {
    console.error(
      "General error populating database:",
      error.response ? error.response.data : error.message
    );
  }
}

createResources();
