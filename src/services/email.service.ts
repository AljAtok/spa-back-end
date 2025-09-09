import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Gmail SMTP: host = 'smtp.gmail.com', port = 465 (secure: true) or 587 (secure: false)
    const smtpHost = (process.env.SMTP_HOST || "smtp.example.com").replace(
      /^ssl:\/\//,
      ""
    );
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const isSecure = smtpPort === 465; // true for 465, false for 587
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASS || "password",
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }) {
    // "From" masking: use "Name <email@domain.com>" format for better display in inboxes
    const fromName = process.env.SMTP_FROM_NAME || "No Reply";
    const fromEmail =
      options.from || process.env.SMTP_FROM || "noreply@example.com";
    const fromMasked = `${fromName} <${fromEmail}>`;

    return this.transporter.sendMail({
      from: fromMasked,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  /**
   * Generates a reusable HTML email template for user welcome/notification.
   * You can extend this for other email types as needed.
   * @param options - Template variables
   */
  generateUserWelcomeEmail(options: {
    userName: string;
    email: string;
    password?: string;
    loginUrl?: string;
    supportEmail?: string;
    companyName?: string;
    projectName?: string;
    projectAbbr?: string;
  }): string {
    const {
      userName,
      email,
      password,
      loginUrl = process.env.FRONTEND_URL || "http://localhost:5173",
      supportEmail = process.env.SUPPORT_EMAIL || "support@bavi.com",
      companyName = process.env.COMPANY_NAME || "Your Company",
      projectName = process.env.PROJECT_NAME || "Your Project",
      projectAbbr = process.env.PROJECT_ABBR || "Your Project",
    } = options;
    return `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 0 0 32px 0;">
          <div style="background: linear-gradient(90deg, #2d6cdf 0%, #4f8cff 100%); padding: 28px 0 18px 0; border-radius: 8px 8px 0 0; text-align: center;">
            <span style="display: inline-block; background: #fff; color: #2d6cdf; font-size: 2.1rem; font-weight: bold; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; box-shadow: 0 2px 8px #0002; margin-bottom: 10px;">${projectAbbr?.toUpperCase()}</span>
            <div style="font-size: 1.35rem; color: #fff; font-weight: 600; margin-top: 6px;">${projectName}</div>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #2d6cdf; margin-top: 0;">Welcome to ${companyName} - ${projectAbbr}!</h2>
            <p>Hi <b>${userName}</b>,</p>
            <p>Your account has been created. Here are your login details:</p>
            <ul style="line-height: 1.7;">
              <li><b>Email:</b> ${email}</li>
              ${password ? `<li><b>Password:</b> ${password}</li>` : ""}
            </ul>
            <div style="margin: 24px 0;">
              <a href="${loginUrl}" style="background: #2d6cdf; color: #fff; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold;">Login Now</a>
            </div>
            <p>If you have any questions, contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
            <p style="color: #888; font-size: 13px;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generates a reusable HTML email template for user reset notification.
   * You can extend this for other email types as needed.
   * @param options - Template variables
   */
  generateUserResetEmail(options: {
    userName: string;
    email: string;
    password?: string;
    loginUrl?: string;
    supportEmail?: string;
    companyName?: string;
    projectName?: string;
    projectAbbr?: string;
  }): string {
    const {
      userName,
      email,
      password,
      loginUrl = process.env.FRONTEND_URL || "http://localhost:5173",
      supportEmail = process.env.SUPPORT_EMAIL || "support@bavi.com",
      companyName = process.env.COMPANY_NAME || "Your Company",
      projectName = process.env.PROJECT_NAME || "Your Project",
      projectAbbr = process.env.PROJECT_ABBR || "Your Project",
    } = options;
    return `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 32px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 0 0 32px 0;">
          <div style="background: linear-gradient(90deg, #2d6cdf 0%, #4f8cff 100%); padding: 28px 0 18px 0; border-radius: 8px 8px 0 0; text-align: center;">
            <span style="display: inline-block; background: #fff; color: #2d6cdf; font-size: 2.1rem; font-weight: bold; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; box-shadow: 0 2px 8px #0002; margin-bottom: 10px;">${projectAbbr?.toUpperCase()}</span>
            <div style="font-size: 1.35rem; color: #fff; font-weight: 600; margin-top: 6px;">${projectName}</div>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #2d6cdf; margin-top: 0;">Password Reset Notification - ${companyName} ${projectAbbr}</h2>
            <p>Hi <b>${userName}</b>,</p>
            <p>Your password has been reset. Here are your updated login details:</p>
            <ul style="line-height: 1.7;">
              <li><b>Email:</b> ${email}</li>
              ${password ? `<li><b>Temporary Password:</b> ${password}</li>` : ""}
            </ul>
            <div style="margin: 24px 0;">
              <a href="${loginUrl}" style="background: #2d6cdf; color: #fff; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold;">Login Now</a>
            </div>
            <p>If you did not request this change or have any questions, contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
            <p style="color: #888; font-size: 13px;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  }
}
