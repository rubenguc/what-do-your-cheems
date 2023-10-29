import mongoose from 'mongoose';

import memes from './seed/memes.json';
import phrases from './seed/phrasetoanswers.json';

const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(`${DB_URI}`, {
    dbName: DB_NAME,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    seed().then(() => {
      console.log('Done seeding');
      // close connection
      mongoose.connection.close();
      process.exit(0);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const seed = async () => {
  const db = mongoose.connection.db;

  await db.collection('memes').insertMany(
    memes.map((meme) => ({
      url: meme.url,
      imageOrientation: meme.imageOrientation,
    })),
  );
  await db
    .collection('phrasetoanswers')
    .insertMany(phrases.map(({ phrase }) => ({ phrase })));

  console.log('Done seeding');
};
