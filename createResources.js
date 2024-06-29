const axios = require("axios");
require("dotenv").config();

const baseURL = process.env.BASE_URL || "http://localhost:4000/api";
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5YUBleGFtcGxlLmNvbSIsImlkIjoiNjY2OTZiYjc5MzIxOGI0MjYzZGZiNmQ5Iiwicm9sZSI6Ik9QRVJBVElPTiIsImlhdCI6MTcxODY3NTg2NSwiZXhwIjoxNzE4Njc3NjY1fQ.Q_TMvRudvhvkwEt9iCqain20_YeCbC_EbNCu4f0S6SA"; // Replace with your admin token

const users = [
  {
    firstName: "Ammar",
    lastName: "Akkram",
    email: "john.doe@example.com",
    password: "password123",
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: "password123",
  },
];

const factories = [{ name: "Factory A" }, { name: "Factory B" }];

const assets = [
  { name: "Asset 1", type: "Type A" },
  { name: "Asset 2", type: "Type B" },
];

const sensors = [
  { name: "Sensor 1", type: "Type A" },
  { name: "Sensor 2", type: "Type B" },
];

const readings = [
  {
    bn: "bn_value",
    bt: 12345,
    bu: "bu_value",
    bv: 123,
    bs: "bs_value",
    bver: 1,
    n: "n_value",
    u: "u_value",
    v: 456,
    vs: "vs_value",
    vb: true,
    vd: 789,
    s: "s_value",
    t: 987,
    ut: "ut_value",
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

async function populateDatabase() {
  try {
    const tokens = {};
    const factoryIds = [];
    const assetIds = [];
    const sensorIds = [];

    // Register users
    for (const user of users) {
      await registerUser(user);
      const token = await loginUser(user);
      tokens[user.email] = token;
    }

    // Create factories
    for (const factory of factories) {
      const factoryData = await createFactory(factory, adminToken);
      factoryIds.push(factoryData._id);
    }

    // Create assets and associate with factories
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const factoryId = factoryIds[i % factoryIds.length];
      const assetData = await createAsset(asset, factoryId, adminToken);
      assetIds.push(assetData._id);
    }

    // Create sensors and associate with assets
    for (let i = 0; i < sensors.length; i++) {
      const sensor = sensors[i];
      const assetId = assetIds[i % assetIds.length];
      const sensorData = await createSensor(sensor, assetId, adminToken);
      sensorIds.push(sensorData._id);
    }

    // Add readings to sensors
    for (const sensorId of sensorIds) {
      for (const reading of readings) {
        await addReading(sensorId, reading, adminToken);
      }
    }

    console.log("Database populated successfully");
  } catch (error) {
    console.error(
      "Error populating database:",
      error.response ? error.response.data : error.message
    );
  }
}

populateDatabase();
