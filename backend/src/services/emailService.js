const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'test',
  },
});

const FROM_NAME = 'Orbit';
const FROM_EMAIL = 'noreply@orbit-app.com';

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Orbit - Your Team Collaboration Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
          .body { padding: 40px; }
          .body h2 { color: #0f172a; margin: 0 0 20px; font-size: 20px; }
          .body p { color: #475569; line-height: 1.6; margin: 0 0 16px; }
          .features { display: flex; flex-direction: column; gap: 12px; margin: 24px 0; }
          .feature { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; }
          .feature-icon { width: 36px; height: 36px; background: #dbeafe; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
          .feature-text { flex: 1; }
          .feature-title { font-weight: 600; color: #0f172a; font-size: 14px; }
          .feature-desc { color: #64748b; font-size: 12px; margin: 2px 0 0; }
          .cta { text-align: center; margin-top: 32px; }
          .cta-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); }
          .footer { padding: 24px 40px; background: #f8fafc; text-align: center; color: #94a3b8; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to Orbit</h1>
            <p>Your all-in-one team collaboration platform</p>
          </div>
          <div class="body">
            <h2>Hi ${name},</h2>
            <p>Thank you for joining Orbit! We're excited to have you on board. With Orbit, you can:</p>
            <div class="features">
              <div class="feature">
                <div class="feature-icon">📋</div>
                <div class="feature-text">
                  <div class="feature-title">Kanban Boards</div>
                  <div class="feature-desc">Organize tasks with drag-and-drop simplicity</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">⏱️</div>
                <div class="feature-text">
                  <div class="feature-title">Time Tracking</div>
                  <div class="feature-desc">Track time spent on tasks automatically</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">📊</div>
                <div class="feature-text">
                  <div class="feature-title">Analytics Dashboard</div>
                  <div class="feature-desc">Monitor team velocity and project progress</div>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">👥</div>
                <div class="feature-text">
                  <div class="feature-title">Team Collaboration</div>
                  <div class="feature-desc">Work together with real-time updates</div>
                </div>
              </div>
            </div>
            <div class="cta">
              <a href="https://orbit-app.com/dashboard" class="cta-button">Go to Your Dashboard →</a>
            </div>
          </div>
          <div class="footer">
            <p>Orbit - Team Collaboration Made Simple</p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${name},\n\nWelcome to Orbit! We're excited to have you. Your account is ready to use.\n\nWith Orbit you can:\n- Manage projects with Kanban boards\n- Track time on tasks\n- View analytics and team performance\n- Collaborate with your team\n\nGet started by visiting your dashboard.\n\nBest regards,\nThe Orbit Team`,
  }),

  taskAssigned: (taskName, projectName) => ({
    subject: `📋 Task Assigned: ${taskName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 32px 40px; }
          .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 700; }
          .body { padding: 40px; }
          .task-card { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 16px 0; border-left: 4px solid #2563EB; }
          .task-name { font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 8px; }
          .project { color: #64748b; font-size: 14px; }
          .cta { text-align: center; margin-top: 24px; }
          .cta-button { display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
          </div>
          <div class="body">
            <p style="color: #475569;">A task has been assigned to you in Orbit:</p>
            <div class="task-card">
              <p class="task-name">${taskName}</p>
              <p class="project">Project: ${projectName}</p>
            </div>
            <div class="cta">
              <a href="https://orbit-app.com/projects" class="cta-button">View Task →</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `A task has been assigned to you: ${taskName} in ${projectName}.\n\nView it in your Orbit dashboard.`,
  }),

  passwordReset: (resetToken) => ({
    subject: '🔐 Reset Your Orbit Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
          .body { padding: 40px; text-align: center; }
          .body p { color: #475569; line-height: 1.6; margin: 0 0 24px; }
          .reset-button { display: inline-block; padding: 16px 32px; background: #DC2626; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 24px; color: #dc2626; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="body">
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <a href="https://orbit-app.com/reset-password?token=${resetToken}" class="reset-button">Reset Password</a>
            <div class="warning">If you didn't request this, please ignore this email and your password will remain unchanged.</div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Reset your Orbit password by visiting: https://orbit-app.com/reset-password?token=${resetToken}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
  }),
};

exports.sendEmail = async (to, template, data = {}) => {
  try {
    let emailContent;
    if (template === 'welcome') {
      emailContent = emailTemplates.welcome(data.name);
    } else if (template === 'taskAssigned') {
      emailContent = emailTemplates.taskAssigned(data.taskName, data.projectName);
    } else if (template === 'passwordReset') {
      emailContent = emailTemplates.passwordReset(data.resetToken);
    } else {
      throw new Error('Unknown email template');
    }

    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    // Don't throw - email failures shouldn't break the app
    return { success: false, error: error.message };
  }
};

exports.sendWelcomeEmail = async (user) => {
  return this.sendEmail(user.email, 'welcome', { name: user.name });
};

exports.sendTaskAssignedEmail = async (userEmail, taskName, projectName) => {
  return this.sendEmail(userEmail, 'taskAssigned', { taskName, projectName });
};

exports.sendPasswordResetEmail = async (email, resetToken) => {
  return this.sendEmail(email, 'passwordReset', { resetToken });
};