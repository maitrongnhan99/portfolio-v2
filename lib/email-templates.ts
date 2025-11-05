/**
 * Email template utilities for Payload CMS
 * Provides reusable HTML email templates with consistent styling
 */

export interface EmailTemplateProps {
  title: string;
  headerTitle: string;
  recipientName: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  warning?: string;
}

/**
 * Base email template with consistent styling
 */
export const createEmailTemplate = ({
  title,
  headerTitle,
  recipientName,
  content,
  buttonText,
  buttonUrl,
  footerText = "This email was sent from Portfolio CMS. Please do not reply to this email.",
  warning
}: EmailTemplateProps): string => {
  const buttonHtml = buttonText && buttonUrl 
    ? `<p style="text-align: center;">
         <a href="${buttonUrl}" class="button">${buttonText}</a>
       </p>
       <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
       <p style="word-break: break-all; color: #667eea;">${buttonUrl}</p>`
    : '';

  const warningHtml = warning 
    ? `<div class="warning">
         <strong>Security Notice:</strong> ${warning}
       </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f5f5f5;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .content h2 {
            color: #333;
            margin: 0 0 20px 0;
            font-size: 20px;
          }
          .content p {
            margin: 0 0 15px 0;
            color: #555;
          }
          .button { 
            display: inline-block; 
            background: #667eea; 
            color: white !important; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: 500;
            transition: background-color 0.2s ease;
          }
          .button:hover {
            background: #5a6fd8;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #6c757d; 
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 15px 0; 
            color: #856404;
          }
          .reset-button {
            background: #dc3545 !important;
          }
          .reset-button:hover {
            background: #c82333 !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${headerTitle}</h1>
          </div>
          <div class="content">
            <h2>Hello ${recipientName}!</h2>
            ${content}
            ${buttonHtml}
            ${warningHtml}
          </div>
          <div class="footer">
            <p>${footerText}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Email verification template
 */
export const createVerificationEmail = (user: any, token: string): string => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000';
  const verifyURL = `${serverUrl}/verify?token=${token}`;
  
  return createEmailTemplate({
    title: "Verify Your Email",
    headerTitle: "Welcome to Portfolio CMS!",
    recipientName: user.firstName || user.email,
    content: `
      <p>Thank you for creating an account with Portfolio CMS. To complete your registration and secure your account, please verify your email address.</p>
    `,
    buttonText: "Verify Email Address",
    buttonUrl: verifyURL,
    warning: "This verification link will expire in 24 hours for security reasons. If you didn't create this account, please ignore this email."
  });
};

/**
 * Password reset email template
 */
export const createPasswordResetEmail = (user: any, token: string): string => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000';
  const resetURL = `${serverUrl}/reset-password?token=${token}`;
  
  return createEmailTemplate({
    title: "Reset Your Password",
    headerTitle: "Password Reset Request",
    recipientName: user.firstName || user.email,
    content: `
      <p>We received a request to reset the password for your Portfolio CMS account.</p>
      <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
    `,
    buttonText: "Reset Password",
    buttonUrl: resetURL,
    warning: "This password reset link will expire in 1 hour for your security."
  });
};

/**
 * Welcome email template (for future use)
 */
export const createWelcomeEmail = (user: any): string => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || 'http://localhost:3000';
  
  return createEmailTemplate({
    title: "Welcome to Portfolio CMS",
    headerTitle: "Welcome Aboard! 🎉",
    recipientName: user.firstName || user.email,
    content: `
      <p>Your email has been successfully verified and your account is now active!</p>
      <p>You now have access to the Portfolio CMS admin panel where you can:</p>
      <ul style="color: #555; padding-left: 20px;">
        <li>Manage your projects and portfolio content</li>
        <li>Upload and organize media files</li>
        <li>Update your profile settings</li>
        <li>Collaborate with team members</li>
      </ul>
      <p>Get started by logging into your admin dashboard.</p>
    `,
    buttonText: "Go to Admin Dashboard",
    buttonUrl: `${serverUrl}/admin`
  });
};