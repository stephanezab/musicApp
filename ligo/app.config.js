import 'dotenv/config';

export default {
    expo: {
      name: "ligo",
      slug: "ligo",
      version: "1.0.0",
      extra: {
        clientId: process.env.CLIENT_ID,
        firebase_apikey: process.env.FIREBASE_APIKEY,
        firebase_authDomain: process.env.FIREBASE_AUTHDOMAIN,
        firebase_projectid: process.env.FIREBASE_PROJECTID,
        firebase_storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebase_messaging_senderid: process.env.FIREBASE_MESSAGING_SENDERID,
        firebase_appid: process.env.FIREBASE_APPID,
        firebase_measurementid: process.env.FIREBASE_MEASUREMENTID
      },
      scheme: "ligoapp",
    },
  };
  