const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

const url = process.env.COSMOS_CONNECTION_STRING;

const c = new MongoClient(url);

app.http("updateprof", {
  methods: ["put"],
  authLevel: "anonymous",
  route: "prof/{id}",
  handler: async (request, context) => {
    await c.connect();
    const database = c.db("university");
    const collection = database.collection("collection1");
    let reqjson = await request.json()

    let query = { _id: request.params.id };
    let newData = { $set: reqjson };

    let update = await collection.findOneAndUpdate(query, newData, {
      returnOriginal: false,
    });

    let Data = await collection.find({}).toArray();

    if (!update) {
      return { status: 400, body: "Can not find Professor to update" };
    }
    return {
      body: JSON.stringify(Data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
