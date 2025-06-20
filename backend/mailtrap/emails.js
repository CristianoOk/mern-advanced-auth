import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import {mailtrapClient, sender} from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{email,}]

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      //text: "Congrats for sending test email with Mailtrap!",
      category: "Email Verification"
      //category: "Integration Test",
    })

    console.log("Email sent successfully", response)

  } catch (error) {
    console.error(`Error sending verification`, error)
    throw new Error(`Error sending email: ${error}`)
  }
}


//Lo de acá lo copié de la documentación oficial de mailtrap, ya que te da una opción de crear un template y te da el código. Bueno podríasreveer el tutorial de YouTube de donde estoy copiando y adaptando this proyect :)
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{email},];

  try {
    const response = await mailtrapClient.send({
      from: sender,
    to: recipient,
    /*Lo comento, porque correspondia al del template creado con el primero correo, ahora estoy usando otro correo (o sea una cuenta nueva en mailtrap), debido a que con el primero termine de usar los 20 mails de prueba. El que estoy usando ahora es roxxi1606@gmail.com.
    template_uuid: "a937e2cb-b822-4f42-9379-8af6184f1ffe",*/
    template_uuid: "ed762810-3fc2-4fea-9690-d1d17458947b",//Correspondiente a la nueva cuenta de mailtrap asociada al correo roxxi1606@gmail.com.
    template_variables: {
      //"company_info_name": "Test_Company_info_name",
      //"name": "Test_Name"
      company_info_name: "Auth Company",
			name: name,
      },
    });

    console.log("Welcome email sent successflly", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    })
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
}

export const sendResetSuccessEmail = async(email) => {
  const recipient = [{email}];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
}