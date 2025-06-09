import { sendEmail } from "../send.email.js";
export const sendLicenseEmail = async ({ email, userName, status }) => {
  const statusMessage =
    status === 'approved'
      ? 'Your license has been approved. You can now access all related services.'
      : 'Unfortunately, your license request has been rejected. Please contact support for more information.';

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>License Status Update</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f5f5f5;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }

      .email-header {
        background-color: #177E39;
        padding: 30px 20px;
        text-align: center;
      }

      .email-header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        letter-spacing: 1px;
      }

      .email-header p {
        color: #ffffff;
        font-style: italic;
        margin: 5px 0 0;
        font-size: 16px;
      }

      .email-body {
        padding: 30px 20px;
        text-align: center;
      }

      .status-box {
        background-color: #f3f9f5;
        padding: 20px;
        border-radius: 8px;
        font-size: 20px;
        font-weight: bold;
        margin: 30px 0;
        color: #177E39;
        border: 2px dashed #177E39;
      }

      .email-footer {
        background-color: #f3f9f5;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }

      .leaf-icon {
        font-size: 24px;
        color: #177E39;
        margin: 0 3px;
      }

      .divider {
        height: 1px;
        background-color: #e0e0e0;
        margin: 30px 0;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>GREENLY</h1>
        <p>License Update Notification</p>
      </div>

      <div class="email-body">
        <h2>Hello ${userName || 'User'},</h2>
        <p>${statusMessage}</p>
        <div class="status-box">Status: ${status.toUpperCase()}</div>

        <div class="divider"></div>
        <p>If you have questions, contact us at 
          <a href="mailto:Greenlyenvironment@gmail.com" style="color: #177E39;">Greenlyenvironment@gmail.com</a>
        </p>
      </div>

      <div class="email-footer">
        <p>© 2025 Greenly. All rights reserved.</p>
        <p>
          <span class="leaf-icon">🍃</span>
          Making the world greener together
          <span class="leaf-icon">🍃</span>
        </p>
        <p>123 Eco Street, Green City, Earth</p>
      </div>
    </div>
  </body>
  </html>`;

  await sendEmail({
    to: email,
    subject: `License Status Update: ${status.toUpperCase()}`,
    html,
  });
};
