import mongoose from 'mongoose';

const DATABASE_URI: string = process.env.DATABASE_URI || '';

mongoose
  .connect(DATABASE_URI)
  .then((res) => {
    //console.info('res:', res);
    console.log('database connected successfuly!');
  })
  .catch((err) => {
    //console.error('err:', err);
    console.log("database doesn't connect, an error has occurred!");
  });
