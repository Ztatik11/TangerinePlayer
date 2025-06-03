import router from './routes/index.js';
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port);
console.log('El servidor furula en el puerto:', port);
