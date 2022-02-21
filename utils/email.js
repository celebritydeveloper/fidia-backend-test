const nodemailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();
import { Secrets } from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS
    auth: {
        user: Secrets.EMAIL_USERNAME,
        pass: Secrets.EMAIL_PASSWORD
    },
  });


  const buildHTML = (path, data = {}) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(`views/emails/${path}.ejs`, data, async (err, html) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(html)
            }
        })
    })
  }

 const sendEmailService = async ({to, data, path, subject, from = '"Team Fadia" <hey@getfidia.com>'}) => {
    try {
      let html = await buildHTML(path, data)
      await transporter.sendMail({
        to,
        from,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
      if(error.response) {
        console.log(error.response.body);
      }
    }
 }

export default sendEmailService;