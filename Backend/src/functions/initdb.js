const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

const url = process.env.COSMOS_CONNECTION_STRING;

const c = new MongoClient(url);

app.http("initdb", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "createnewdb",
  handler: async (request, context) => {
    await c.connect();
    const database = c.db("university");
    const collection = database.collection("collection1");
    await collection.deleteMany({});

    return { body: "DataBase is now initialized" };
  },
});
