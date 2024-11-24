import mongoose from 'mongoose';

const DATABASE_URI: string = process.env.DATABASE_URI || '';

mongoose
  .connect(DATABASE_URI)
  .then((res) => {
    //console.info('res:', res);
    console.info('Database connected successfuly!');
  })
  .catch((err) => {
    //console.error('err:', err);
    console.info("Database doesn't connect, an error has occurred!");
  });
