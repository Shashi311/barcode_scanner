const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 8080;
const connection = mongoose.connect(process.env.MONGODB_URL);

const dataSchema = new mongoose.Schema(
  {
    species_name: {
      common: { type: String, required: true },
      scientific: { type: String, required: true },
    },
    image: { type: String, required: true },
    individual_identification: {
      name: { type: String, required: true },
      id: { type: String, required: true, unique: true },
    },
    sex: { type: String, required: true },
    age: {
      date_of_birth: { type: Date, required: true },
      estimated_age: { type: Number, required: true },
    },
    origin: { type: String, required: true },
    health_and_medical: {
      medical_history: [
        {
          date: { type: Date, required: true },
          condition: { type: String, required: true },
          treatment: { type: String, required: true },
          outcome: { type: String, required: true },
        },
      ],
      vaccination_records: [
        {
          date: { type: Date, required: true },
          vaccine: { type: String, required: true },
        },
      ],
      diet_and_feeding_schedule: {
        diet: { type: String, required: true },
        feeding_times: [{ type: String, required: true }],
      },
      behavioral_history: { type: String, required: true },
      reproductive_history: { type: String, required: true },
      current_medications: { type: String, required: true },
    },
    habitat_and_enrichment: {
      enclosure_specifications: {
        size: { type: String, required: true },
        design: { type: String, required: true },
        temperature: { type: String, required: true },
        humidity: { type: String, required: true },
      },
      enrichment_activities: [{ type: String, required: true }],
      cleaning_and_maintenance_schedule: { type: String, required: true },
    },
    legal_and_regulatory: {
      permits_and_licenses: { type: String, required: true },
      conservation_status: { type: String, required: true },
    },
    staff_and_care: {
      primary_caretaker: {
        name: { type: String, required: true },
        contact: { type: String, required: true },
      },
      emergency_protocols: { type: String, required: true },
      training_records: [
        {
          date: { type: Date, required: true },
          training: { type: String, required: true },
        },
      ],
    },
    visitor_and_educational: {
      educational_signage: { type: String, required: true },
      public_interaction_guidelines: { type: String, required: true },
    },
    data_management: {
      record_keeping_system: { type: String, required: true },
      backup_procedures: { type: String, required: true },
    },
  },
  {
    versionKey: false,
  }
);

const Data = mongoose.model("Data", dataSchema);

app.get("/data", async (req, res) => {
  try {
    const allData = await Data.find({});
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/data", async (req, res) => {
  try {
    const newData = req.body;
    const createdData = await Data.create(newData);
    res.status(201).json(createdData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New route to handle barcode lookup
app.post("/barcode", async (req, res) => {
  const { barcode } = req.body;
  try {
    const entry = await Data.findOne({
      "individual_identification.id": barcode,
    });
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ error: "Barcode not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running on port ${port}`);
});
