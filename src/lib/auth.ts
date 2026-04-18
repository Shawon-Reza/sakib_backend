import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");

if (!smtpUser || !smtpPass) {
  throw new Error(
    "Missing SMTP credentials. Set SMTP_USER and SMTP_PASS in your environment."
  );
}

if (!smtpUser.includes("@")) {
  console.warn(
    "SMTP_USER does not look like an email address. For Gmail, use your full Gmail address."
  );
}

// ==================== Setting up Nodemailer Transporter for Email Sending ====================\\
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const logMailError = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "responseCode" in error &&
    (error as { code?: string }).code === "EAUTH" &&
    (error as { responseCode?: number }).responseCode === 535
  ) {
    console.error(
      "Error while sending mail: Gmail rejected login. Use your Gmail address as SMTP_USER and a 16-character Google App Password as SMTP_PASS (not your regular Gmail password)."
    );
    return;
  }

  console.error("Error while sending mail:", error);
};



export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",           // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, 
    sendVerificationEmail: true,
    // =================== Password Reset Email Configuration ====================\\
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        console.log("URL:", url, "Token:", token)
        const info = await transporter.sendMail({
          from: '"Reset" <team@example.com>', // sender address
          to: `${user.email}`, // list of recipients
          subject: "Reset Your Password", // subject line
          text: `Click the link to reset your password: ${url}`, // plain text body
          html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
      
      <h2 style="color: #333;">Reset Your Password</h2>

      <p style="color: #555; font-size: 14px;">
        Hi ${user.name || "there"}, 👋 <br/><br/>
        We received a request to reset your password. Click the button below to set a new one.
      </p>

      <a href="${url}" 
         style="
           display: inline-block;
           margin-top: 20px;
           padding: 12px 24px;
           background-color: #ef4444;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
         Reset Password
      </a>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        This link will expire soon for security reasons.
      </p>

      <p style="margin-top: 10px; font-size: 12px; color: #888;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaa;">
        Or copy and paste this link:<br/>
        <a href="${url}" style="color: #ef4444;">${url}</a>
      </p>

    </div>
  </div>
`// HTML body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      } catch (error) {
        logMailError(error);
      }

    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },

  },
  // ===================== Adding Custom Fields to User Model ====================\\
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        defaultValue: "USER",
        required: true,
        unique: false,
      }

      ,
      phone: {
        type: "string",
        required: false,
        input: true,

      },
    }
  },

  // ==================== Email verification send configuration ====================\\
  emailVerification: {
    sendOnSignUp: true,
    enabled: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        // console.log(user)
        const info = await transporter.sendMail({
          from: '"Sakib" <prisma@prismapractice.com>',
          to: `${user.email}`, // list of recipients
          subject: "Verify Your Email", // subject line
          text: `Hi ${user.name || "there"},\n\nPlease verify your email address by clicking the link below:\n\n${url}\n\nIf you didn’t create an account, you can safely ignore this email.`, // plain text body
          html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; text-align: center;">
      
      <h2 style="color: #333;">Verify Your Email</h2>
      
      <p style="color: #555; font-size: 14px;">
        Hi ${user.name || "there"}, 👋 <br/><br/>
        Thanks for signing up! Please confirm your email address by clicking the button below.
      </p>

      <a href="${url}" 
         style="
           display: inline-block;
           margin-top: 20px;
           padding: 12px 24px;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
         Verify Email
      </a>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">
        If you didn’t create an account, you can safely ignore this email.
      </p>

      <hr style="margin: 30px 0;" />

      <p style="font-size: 12px; color: #aaa;">
        Or copy and paste this link:<br/>
        <a href="${url}" style="color: #4f46e5;">${url}</a>
      </p>

    </div>
  </div>
` // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (err) {
        logMailError(err);
      }
    },
  },
  // =================== Password Reset Email Configuration ====================\\


});

