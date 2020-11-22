// Must implement.

// export async function clearFirestoreData(subCollections?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>[]) {
//   const collections = subCollections ?? (await firebase.firestore().listCollections());
//   for (const coll of collections) {
//     // Get a new write batch
//     const batch = firebase.firestore().batch();
//     const documents = await coll.listDocuments();
//
//     for (const doc of documents) {
//       await clearFirestoreData(await doc.listCollections());
//       batch.delete(doc);
//     }
//     await batch.commit();
//   }
//   return;
// }
