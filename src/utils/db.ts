import { connect } from 'mongoose';
import constant from './config';

const connectDb = async (): Promise<unknown> => {
  try {
    return await connect(constant.DBNAME as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }).then(() => console.log('Connected to database'));
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
