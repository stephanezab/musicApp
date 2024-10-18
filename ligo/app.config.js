import 'dotenv/config';

console.log(process.env.CLIENT_ID)
export default {
    expo: {
      name: "ligo",
      slug: "ligo",
      version: "1.0.0",
      extra: {
        clientId: process.env.CLIENT_ID,
      },
      scheme: "ligoapp",
    },
  };
  