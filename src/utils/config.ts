import { config } from 'dotenv';

config();
const { DBNAME, SECRETNAME, NODEMAILER_USER, NODEMAILER_PASSWORD, BASE_URL } = process.env;

const constant = {
  DBNAME,
  SECRETNAME,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  BASE_URL,
};

export default constant;
