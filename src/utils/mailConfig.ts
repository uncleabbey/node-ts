import nodemailer from 'nodemailer';
import constants from './config';

const transport = nodemailer.createTransport({
  service: 'Yahoo',
  secure: true,
  auth: {
    user: constants.NODEMAILER_USER,
    pass: constants.NODEMAILER_PASSWORD,
  },
});

export default transport;
