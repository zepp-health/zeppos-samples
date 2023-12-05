const Koa = require("koa");
const Router = require("koa-router");
const { bodyParser } = require("@koa/bodyparser");
const { mongodbUri } = require("./config");

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = mongodbUri;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = new Koa();
const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello Zepp OS";
});

router.post("/sleep", async (ctx) => {
  const body = ctx.request.body;

  // 这里获取数据
  try {
    await run(body);

    ctx.response.body = {
      code: 0,
      message: "SUCCESS",
    };
  } catch (error) {
    console.error(error);
    ctx.response.body = {
      code: -1,
      message: "FAILED",
    };
  }
});

app.use(bodyParser());
app.use(router.routes());

app.listen(4080);
console.log("[demo] server is starting at port 4080");

async function run(params = {}) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const dbName = "sample_zepp";
    const collectionName = "sleep_data";

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const insertResult = await collection.insertOne(params);
    console.log(`${insertResult} documents successfully inserted.\n`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
