/* eslint-disable no-console */
import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import { router } from './routes/auth.routes.js';

const app = express();
const route = router;

app.use(express.json());
app.use('/account', route);

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'));
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (err) {
    console.log(`server error${err}`);
    process.exit(1);
  }
}

start();

app.get('/', (req, res) => {
  res.send('Hello world!');
});
