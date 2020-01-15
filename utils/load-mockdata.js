const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const items = require('./MOCK_DATA').items;

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "<YOUR API KEY>",
    authDomain: "<YOUR AUTH DOMAIN>",
    projectId: "<YOUR PROJECT ID>"
});

const db = firebase.firestore();

const fire = async () => {
    console.log(`Writing items...`)
    const promises = items.map((obj) => {
        return db.collection("items").add(obj).catch((error) => {
            console.error("Error adding document: ", error);
        });
    });

    await Promise.all(promises);
    console.log(`All done`);
}

fire().then(process.exit);
