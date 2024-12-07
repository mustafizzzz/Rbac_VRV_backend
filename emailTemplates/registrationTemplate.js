const otpVerificationTemplate = (username, otp, year) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your One-Time Password</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .otp-code {
                font-size: 32px;
                letter-spacing: 10px;
                text-align: center;
                color: #4a90e2;
                background-color: #f0f6ff;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 style="color: #333; text-align: center;">Verify Your Account</h1>
            
            <p>Hello ${username},</p>
            
            <p>You've requested to verify your account. Please use the following One-Time Password (OTP) to complete the process:</p>
            
            <div class="otp-code">
                ${otp}
            </div>
            
            <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            
            <p>If you didn't request this verification, please ignore this email or contact our support team.</p>
            
            <div class="footer">
                © ${year} Your Company Name. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = otpVerificationTemplate;
