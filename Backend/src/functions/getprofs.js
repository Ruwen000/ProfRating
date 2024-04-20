const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

const url = process.env.COSMOS_CONNECTION_STRING;

const c = new MongoClient(url);

app.http("getprofs", {
  methods: ["get"],
  authLevel: "anonymous",
  route: "prof",
  handler: async (request, context) => {
    await c.connect();
    const database = c.db("university");
    const collection = database.collection("collection1");

    let prof = await collection.find({}).toArray();

    return {
      body: JSON.stringify(prof),
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
