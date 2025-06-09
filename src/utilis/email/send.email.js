import nodemailer from 'nodemailer'

export const sendEmail = async({
        from=[],
        to=[],
        cc=[],
        bcc='',
        text='',
        html='',
        subject='Welcome to greenly',
        attachments=[],
}= {})=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
        },
    });
    
        const info = await transporter.sendMail({
        from:`"Greenly" <${process.env.EMAIL}>`,
        to,
        cc,
        bcc,
        text,
        html,
        subject,
        attachments,
        });
        console.log("Message sent: %s", info.messageId);
    }
