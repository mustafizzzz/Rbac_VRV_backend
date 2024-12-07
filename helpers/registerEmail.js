const { Resend } = require('resend');
const otpVerificationTemplate = require('../emailTemplates/registrationTemplate');

const resendClient = new Resend(process.env.RESEND_API_KEY); // Replace with your Resend API key

const sendVerificationEmail = async (email, username, verifyCode) => {
    try {
        const currentYear = new Date().getFullYear();
        const emailContent = otpVerificationTemplate(username, verifyCode, currentYear);
        await resendClient.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify Your Account',
            html: emailContent,
        });
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        return { success: false, message: 'Failed to send OTP email' };
    }
}

module.exports = sendVerificationEmail;