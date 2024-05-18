import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "wen-l7ajez-1",
    private_key_id: "93b935054bfa33ccc68e64ac88232d4e534b736a",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDtCWs1P+jzhPbK\n67G+p0BZi7dL7uftN69BbXaieTI7+0Va7hjzHpypS/WHuBT8tqGR+y6NxSDFTKaP\n9fKXc03CoaCnX71OVrsEUx3CCE1yo6w/8quXeqWq5z92DNaDIF2MN9OtgKz84Yxr\nmiY4hnoLpfPmxXU/F574lY1g/qZk2sU5eM+Uv/fYQUzdl5gcY141y5df3CeeHPOA\n+CGS0qBAD2VubY+dDXSRtl8hXyrlX6uIHTCOROtzfi8EVaRNjzoje3jYH3yp+ylZ\nkFRL4DK8DdjpRDJfFSvLT8Zjv0eI2MZzBVELLSrv3hO/kWhLbuGcKDWw8divrAKy\neYYAyWQbAgMBAAECggEAL6DbXl1DoR7f+gEm+3Ce4P9Oat8L0iIEwIhOtLHWkq/Y\nDT/XWo6VmvzszoMCEI9f4rXOcmUgQxS2SSn5v03HW6rfXZJCtwl9VY6f5ZuGeFkD\n5OuNaAgYXsFNgppsxfdMZL7Y9T1sRPnLHdnhAS2gO1PysLWPbAiChF+Eg29Xnt7l\njMUZaJeQ0k8jVC+4Tbp855b0yg2LpjcIDnrgwQV4Lx88ibJ4sgFveIgSllRpLow+\nno0S3916KkTyuHiTrZ36e5RPGujAt8s/bo78O46DOlR+b3DIHIKXLUa8wOv1SDhs\ndbN8iNhLBCnRaU8F2aCXf2OBBEy3HBlUKE3JWO1XSQKBgQD6kWuElnEu1RdyuWul\n51rtXdIquFbyxDuEVFV/Jxb9+VRxiMqDPKAWxWWeAuKQHov4i6ZdxTbD0QdVdzMs\nvyHhu4ROJ1FWHfEgq4mY8UTmQ7eQoW3lZRlIZMLmMsHADazckPlLgNuME6RwL7hG\nQKFcPkM1EKlWrxeTl2jTpSskQwKBgQDyLOd83SSe7S1guuk6IyveQxVhyXxd7Gda\netrP/a1IbldswkPZ4/yzTpqMLNzm7N0G+2ublfMVZRHKGQp5iRZ0cB1zbp+ZJZla\ndZU5TBvuCq32ehsH7bGX6pc3qPjSGXDk5OVhIIIqbtZu9rBVmFRdy95Tl27xcBc7\nuOv7D4FvSQKBgQCory2K3RzlQl++xEVMMyxrkDXkvKUMWj8XHw9Pwqkf4bKPnF95\nal779XgroBWWoHnqoVkm15W+zgH5731sKmBM70hqtN109ENYkyLW69ZOjlgN7h9l\nx2H18p+jCZiWCp7M/mxWADHNY4vYWsfbw7bduqzUFJtr2AQvQEc59H/OsQKBgQDi\nJizF3X0lLDcD7Yd+UvnURLDi8FTDINAjHjbXo/z9do0NcxwJjW2dw/lujTZ8LxT4\nQDDsycqGYCuMnnW5qNrfQRM/iD5htUrPvp3rM7ehQzfQw5YagU0moFs2DwTMrhVO\nqrHJUaI8HeUBGjzwsZ+XN5oWVYO00wffLYCwonosgQKBgQCrwiZcLvgVd06UFMZP\nNIQfT4vFerCcG0kryJf/LpyWXN3jZasxfIhdksWNHMCiWLkvCT5kBOM0f0v8vpb+\nGA8Hf9Z/ArMx+CxZLa3o9oJ8BgSJjxDvlG95iA/PApMqAuZ/0WPaxWLQvXtSV4ze\nG68yzvUZuq7/LmqZAjwR554l/w==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-decld@wen-l7ajez-1.iam.gserviceaccount.com",
    client_id: "113803706995385507627",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-decld%40wen-l7ajez-1.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
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
