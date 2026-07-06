require("dotenv").config({ path: ".env.local" });
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  console.error(
    "Missing Firebase credentials. Check that .env.local has FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = getFirestore(app);
const COLLECTION_NAME = "temples";

const storiesDir = path.join(__dirname, "stories");
const files = fs.readdirSync(storiesDir).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
  console.log("No JSON files found in ./scripts/stories - nothing to upload.");
  process.exit(0);
}

async function uploadAll() {
  console.log(`Found ${files.length} story file(s). Starting upload...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(storiesDir, file);

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);

      if (!data.slug) {
        console.warn(`Skipping ${file} - missing "slug" field (required as doc ID).`);
        failCount++;
        continue;
      }

      data.updatedAt = FieldValue.serverTimestamp();

      await db.collection(COLLECTION_NAME).doc(data.slug).set(data, { merge: true });

      console.log(`Uploaded: ${file} -> ${COLLECTION_NAME}/${data.slug}`);
      successCount++;
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err.message);
      failCount++;
    }
  }

  console.log(`\nDone. ${successCount} uploaded, ${failCount} failed.`);
  process.exit(0);
}

uploadAll();