export const verifyAcc = ({code}={})=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Greenly - Email Confirmation</title>
  <style>
    /* Base styles for compatibility across email clients */
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
    
    .welcome-message {
      font-size: 22px;
      margin-bottom: 20px;
      color: #177E39;
    }
    
    .email-content {
      font-size: 16px;
      margin-bottom: 25px;
      text-align: left;
    }
    
    .verification-code {
      background-color: #f3f9f5;
      padding: 20px;
      border-radius: 8px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      margin: 30px 0;
      color: #177E39;
      border: 2px dashed #177E39;
    }
    
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #177E39;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }
    
    .social-icons {
      margin: 25px 0;
    }
    
    .social-icon {
      display: inline-block;
      margin: 0 10px;
      width: 40px;
      height: 40px;
      background-color: #177E39;
      border-radius: 50%;
      padding: 8px;
      box-sizing: border-box;
    }
    
    .social-icon svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
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
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>GREENLY</h1>
      <p>Connect with Nature</p>
    </div>
    
    <div class="email-body">
      <div class="welcome-message">Welcome to Greenly!</div>
      
      <div class="email-content">
        <p>Thank you for joining the Greenly community. We're thrilled to have you with us on this journey toward a more sustainable future.</p>
        <p>To complete your registration, please use the verification code below:</p>
      </div>
      
      <div class="verification-code">${code}</div>
      
      <div class="email-content">
        <p>This code will expire in 24 hours. If you didn't sign up for a Greenly account, you can safely ignore this email.</p>
      </div>
      
      <a href="#" class="button">Verify My Account</a>
      
      <div class="divider"></div>
      
      <div class="email-content">
        <p>Need help? Contact our support team at <a href="mailto:Greenlyenvironment@gmail.com" style="color: #177E39;">Greenlyenvironment@gmail.com</a></p>
      </div>
      
      <div class="social-icons">
        <a href="#" class="social-icon">
          <svg fill="#ffffff" viewBox="0 0 24 24">
            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg fill="#ffffff" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg fill="#ffffff" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg fill="#ffffff" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
    
    <div class="email-footer">
      <p>© 2025 Greenly. All rights reserved.</p>
      <p>
        <span class="leaf-icon">🍃</span>
        Thank you for helping us make the world greener!
        <span class="leaf-icon">🍃</span>
      </p>
      <p>123 Eco Street, Green City, Earth</p>
    </div>
  </div>
</body>
</html>`
}
