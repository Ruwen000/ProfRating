const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const url = process.env.COSMOS_CONNECTION_STRING;


const client = new MongoClient(url);

app.http("post-prof", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "prof",
  handler: async (request, context) => {
    await client.connect();
    const database = client.db("prof");
    const collection = database.collection("collection1");

    let data = await request.json()

    let newdata = {
      _id: uuidv4(),
      name: data.name,
      rating: data.rating,
      categoryId: "someValue", 
    };

    let insert = await collection.insertOne(newdata);
    if (!insert) {
      return { status: 400, body: "add" };
    }

    let stupidData = await collection.find({}).toArray();


    return {
      body: JSON.stringify(stupidData),
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
