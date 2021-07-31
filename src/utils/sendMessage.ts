import constant from './config';
import transport from './mailConfig';
import { htmlMessage, textMessage } from './message';

const sendMessage = async (name: string, userId: string, verifyToken: string): Promise<unknown> => {
  const url = `${constant.BASE_URL}/api/v1/auth/verify/${userId}/${verifyToken}`;
  const messageConfig = {
    from: constant.NODEMAILER_USER,
    to: 'abbeyunique2@gmail.com',
    subject: `Message from ${'Kayode'}`,
    text: textMessage(name, url),
    html: htmlMessage(name, url),
  };
  try {
    const info = await transport.sendMail(messageConfig);
    return info;
  } catch (error) {
    return error;
  }
};

export default sendMessage;
