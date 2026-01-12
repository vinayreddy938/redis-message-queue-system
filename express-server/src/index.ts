import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

app.post("/submit", async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    await client.lPush(
      "problems",
      JSON.stringify({ problemId, code, language })
    );

    res.status(200).send("Submission received and stored");
  } catch (err) {
    console.log("Redis error!", err);
    res.status(500).send("Failed to store submission");
  }
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(4000, () => {
      console.log("Server started on port 4000");
    });
  } catch (err) {
    console.log("Startup error:", err);
  }
}

main();
