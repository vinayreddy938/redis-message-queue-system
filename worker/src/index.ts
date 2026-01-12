import { createClient } from "redis";

const client = createClient();
//@ts-ignore
client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  // Here we have to add your actual processing logic 

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis.");

    while (true) {
      try {
        const submission = await client.brPop("problems", 0);

        if (submission) {
          await processSubmission(submission.element);
        }
      } catch (err) {
        console.error("Error processing submission:", err);
      }
    }
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
}

startWorker();
