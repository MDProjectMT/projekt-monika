import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 5000;
const dataBase = process.env.DATABASE_URL;

if (!dataBase) {
  console.log("Coś jest nie tak i baza danych nie została podłączona");
  process.exit(1);
}

mongoose
  .connect(dataBase, {})
  .then(() => {
    console.log("Baza danych działa");
    app.listen(port, () => {
      console.log(`Serwer ruszył na porcie ${port}`);
    });
  })
  .catch((error) => {
    console.error("Serwer nie działa" + error.message);
    process.exit(1);
  });

//   import express from "express";
//   import dotenv from "dotenv";
//   // import authRoutes from "./routes/authRoutes.js";
//   // import raportsRoutes from "./routes/raportsRoutes.js";
//   // import transactionRoutes from "./routes/transactionRoutes.js";

//   const app = express();
//   dotenv.config();

//   app.use(express.json()); //parsowanie prostrzych json application/json
//   app.use(express.urlencoded({ extended: true })); //parsowanie tablic przy zapytaniach application/x-www-form-urlencoded

//   // app.use("/", authRoutes);
//   // app.use("/", raportsRoutes);
//   // app.use("/", transactionRoutes);

//   export default app;
