const nodemailer = require("nodemailer");
const otpVerificationTemplate = require('../emailTemplates/registrationTemplate');

// const resendClient = new Resend(process.env.RESEND_API_KEY); // Replace with your Resend API key

const sendVerificationEmail = async (email, username, verifyCode) => {
    try {
        const currentYear = new Date().getFullYear();
        // const emailContent = otpVerificationTemplate(username, verifyCode, currentYear);
        // await resendClient.emails.send({
        //     from: 'Acme <onboarding@resend.dev>',
        //     to: email,
        //     subject: 'Verify Your Account',
        //     html: emailContent,
        // });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.email",
            port: 587,
            secure: false,
            auth: {
                user: "mustafizansari35@gmail.com",
                pass: "zsdaavptouunkktu",
            },
        });
        const emailContent = otpVerificationTemplate(username, verifyCode, currentYear);

        const mailOptions = {
            from: "mustafizansari35@gmail.com",
            to: email,
            subject: 'Verify your email address',
            text: `Hello ${username},\n\nYour verification code is: ${verifyCode}\n\nThis code will expire in 1 hour.`,
            html: emailContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        return { success: false, message: 'Failed to send OTP email' };
    }
}



module.exports = sendVerificationEmail;