const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

const url = process.env.COSMOS_CONNECTION_STRING;

const c = new MongoClient(url);

app.http("getprof", {
  methods: ["get"],
  authLevel: "anonymous",
  route: "prof/{id}",
  handler: async (request, context) => {
    await c.connect();
    const database = c.db("university");
    const collection = database.collection("collection1");
    let prof = await collection.findOne({ _id: request.params.id });

    if (!prof) {
      return { status: 400, body: "Unable to find Professor in the data base" };
    }

    return {
      body: JSON.stringify(prof),
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
