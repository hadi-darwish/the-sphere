import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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

export default archiveOldReports;
