const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

const url = process.env.COSMOS_CONNECTION_STRING;

const c = new MongoClient(url);

app.http("removeprof", {
  methods: ["delete"],
  authLevel: "anonymous",
  route: "prof/{id}",
  handler: async (request, context) => {
    await c.connect();
    const database = c.db("university");
    const collection = database.collection("collection1");

    let prof = await collection.deleteOne({ _id: request.params.id });

    let data = await collection.find({}).toArray();

    if (!prof) {
      return { status: 400, body: "Can not find Professor to delete" };
    }

    return {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
