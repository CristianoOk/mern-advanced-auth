//ES UNA API, LA PÁGINA ES ESTA: https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbjJQU01KV0VaWnFKWjdZSEtCSW1rQWE5MGJKUXxBQ3Jtc0tsSEJHMmk0YzNWamFmX2FlWERJQWNiUEZJTlcxYXE1WTY4Q2t4cy1TQnZHaThUQ2Nqc05VNnRWbGNzUnhnaGN5VmlsaU9xT3VQczNmeXdDXzU2MFVxUVNPNmw1SjdscGFsMWRhUng2ZzFVLXVXQ1JCVQ&q=https%3A%2F%2Fl.rw.rw%2Fas_a_programmer&v=pmvEgZC55Cg


import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

console.log("🔐 Token actual:", process.env.MAILTRAP_TOKEN)






/* 
//const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config(); // 👈 esta línea es obligatoria para cargar el .env

//const TOKEN = "<YOUR_API_TOKEN>"; //así lo traje de la documentación de mailtrap, pero acá voy a trabajar con mi archivo .env
const TOKEN = process.env.MAILTRAP_TOKEN

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "agustinortizn14@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "HOLIIII!",
    category: "Integration Test",
  })
  .then(console.log, console.error);

  console.log(process.env.MAILTRAP_TOKEN)
*/