import nodemailer from "nodemailer";
import * as env from "dotenv";

env.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateMessageId() {
  return `<${Date.now()}@gmail.com>`;
}

const sendEmail = async (email, email_subject, body) => {
  const messageId = generateMessageId();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: email_subject,
    text: body,
    messageId: messageId,
    headers: {
      "Message-ID": messageId,
      "In-Reply-To": null, // or ""
      "References": null, // or ""
    },
  };

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email in nodemailer.js:", error);
    return null;
  }
};

const firstSuccessfulToApplicant = async (email) => {
  let email_subject = "Referral request successfully proccessed";
  let email_body =
    "We're pleased to inform you that your referral request has been successfully processed. You can expect a response within 4 days.";
  sendEmail(email, email_subject, email_body);
};

const firstSuccessfulToEmployee = async (email) => {
  let email_subject = "Referral request received";
  let email_body =
    "You have one pending referral request! Please attend to it within 24 hours, as the request will expire after this time.";
  sendEmail(email, email_subject, email_body);
};

const firstFailToApplicant = async (email) => {
  let email_subject = "Referral request failed";
  let email_body =
    "We regret to inform you that we are currently unable to process your referral request due to the temporary unavailability of employees who can assist you. Please try again later.";
  sendEmail(email, email_subject, email_body);
};

const acceptedToApplicant = async (email) => {
  let email_subject = "Referral approved";
  let email_body =
    "Congratulations! We're pleased to inform you that your referral request has been approved by an employee at your desired company. You've been referred for the requested job role. The ProRefer team wishes you the best for the next steps in the process.";
  sendEmail(email, email_subject, email_body);
};

const rejectedToApplicant = async (email) => {
  let email_subject = "Referral request result";
  let email_body =
    "ProRefer has forwarded your referral request to several employees listed on our site. However, we regret to inform you that your resume was not shortlisted and, consequently, not referred. We wish you the best for your future endeavors.";
  sendEmail(email, email_subject, email_body);
};

export {
  firstSuccessfulToApplicant,
  firstSuccessfulToEmployee,
  firstFailToApplicant,
  acceptedToApplicant,
  rejectedToApplicant
};
