const otpEmailTemplate = (otp, userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Echo Account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #030712;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    }

    .email-wrapper {
      background-color: #030712;
      padding: 40px 20px;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .email-header {
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      padding: 40px 24px;
      text-align: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .sparkles {
      width: 32px;
      height: 32px;
      color: #ffffff;
    }

    .logo-text {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    .email-title {
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      margin: 16px 0 0 0;
    }

    .email-body {
      padding: 40px 32px;
    }

    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #f3f4f6;
      margin: 0 0 16px 0;
    }

    .body-text {
      font-size: 16px;
      line-height: 1.6;
      color: #d1d5db;
      margin: 0 0 24px 0;
    }

    .otp-container {
      background: linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 100%);
      border: 2px solid #4c1d95;
      border-radius: 12px;
      padding: 32px;
      margin: 32px 0;
      text-align: center;
    }

    .otp-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #c4b5fd;
      margin: 0 0 16px 0;
    }

    .otp-code {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 12px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .info-box {
      background-color: #1f2937;
      border-left: 4px solid #9333ea;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }

    .info-text {
      font-size: 14px;
      line-height: 1.5;
      color: #9ca3af;
      margin: 0;
    }

    .info-text strong {
      color: #d1d5db;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%);
      margin: 32px 0;
    }

    .security-notice {
      font-size: 14px;
      line-height: 1.5;
      color: #9ca3af;
      margin: 0;
    }

    .email-footer {
      background-color: #0f172a;
      padding: 32px 24px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }

    .footer-text {
      font-size: 13px;
      color: #6b7280;
      margin: 8px 0;
    }

    .footer-brand {
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }

    @media (max-width: 600px) {
      .email-wrapper {
        padding: 20px 12px;
      }

      .email-body {
        padding: 32px 20px;
      }

      .otp-code {
        font-size: 36px;
        letter-spacing: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <div class="logo-container">
          <svg class="sparkles" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
          </svg>
          <h1 class="logo-text">Echo</h1>
        </div>
        <p class="email-title">Verify Your Account</p>
      </div>

      <div class="email-body">
        <p class="greeting">Hello ${userName || 'there'},</p>
        <p class="body-text">
          Welcome to Echo! We're excited to have you join our community of authentic moments.
          To complete your registration and start sharing, please verify your email address with the code below:
        </p>

        <div class="otp-container">
          <p class="otp-label">Your Verification Code</p>
          <p class="otp-code">${otp}</p>
        </div>

        <div class="info-box">
          <p class="info-text">
            <strong>Important:</strong> This code is valid for <strong>10 minutes</strong> and can only be used once.
            Keep it secure and don't share it with anyone.
          </p>
        </div>

        <div class="divider"></div>

        <p class="security-notice">
          If you didn't create an Echo account, please ignore this email or contact our support team if you have concerns about your account security.
        </p>
      </div>

      <div class="email-footer">
        <p class="footer-brand">Echo</p>
        <p class="footer-text">Share moments that fade away</p>
        <p class="footer-text">&copy; ${new Date().getFullYear()} Echo. All rights reserved.</p>
        <p class="footer-text" style="margin-top: 16px;">This is an automated message, please do not reply.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = otpEmailTemplate; 