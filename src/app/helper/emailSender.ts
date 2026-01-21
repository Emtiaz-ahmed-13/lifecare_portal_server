import nodemailer from 'nodemailer';
import config from '../../config';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.email,
        pass: config.appPass,
    },
});

const sendEmail = async (to: string, subject: string, html: string) => {
    const info = await transporter.sendMail({
        from: '"LifeCare Portal" <no-reply@lifecare.com>',
        to,
        subject,
        html,
    });

    console.log("Message sent: %s", info.messageId);
};

export const EmailHelper = {
    sendEmail
};
