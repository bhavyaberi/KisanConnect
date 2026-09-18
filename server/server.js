const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectMongoDB = require("./config/mongo");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`KisanConnect server running on port ${PORT}`);
  });
};

startServer();
