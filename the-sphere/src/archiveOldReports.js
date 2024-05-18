/* eslint-disable no-undef */
const admin = require("firebase-admin");

// Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json"); // path to your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Create a function to archive old reports
async function archiveOldReports() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const snapshot = await db
    .collection("reports")
    .where("timestamp", "<=", oneHourAgo)
    .get();

  if (!snapshot.empty) {
    const batch = db.batch();
    const archiveRef = db.collection("archived");

    snapshot.docs.forEach((doc) => {
      const archiveDocRef = archiveRef.doc(doc.id);
      batch.set(archiveDocRef, doc.data());
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("Archived old reports.");
  }
}

// Export the function so it can be imported and called in a Next.js page
module.exports = archiveOldReports;
