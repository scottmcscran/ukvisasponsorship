const nodemailer = require(`nodemailer`);
const pug = require(`pug`);
const { convert } = require(`html-to-text`);

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(` `)[0];
    this.url = url;
    this.from = `Uk Visa Sponsorship <${process.env.EMAIL_FROM || "mail@ukvisasponsorship.com"}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === `production`)
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_SMTP_KEY,
        },
      });

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendApplication(applicant, job, cvFile) {
    const html = pug.renderFile(`${__dirname}/../views/email/application.pug`, {
      employerName: this.firstName,
      applicantName: applicant.name,
      jobTitle: job.title,
      applicantEmail: applicant.email,
      subject: `New Application for ${job.title}`,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: `New Application: ${job.title}`,
      html,
      text: convert(html),
      replyTo: applicant.email,
      attachments: [
        {
          filename: cvFile.originalname,
          content: cvFile.buffer,
        },
      ],
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(`welcome`, `Welcome to the Uk Visa Sponsorship Family!`);
  }

  async sendPasswordReset() {
    await this.send(
      `passwordReset`,
      `Your password reset token (valid for 10 minutes)`
    );
  }

  async sendAccountVerified() {
    await this.send(`accountVerified`, `Your account has been verified!`);
  }
};
