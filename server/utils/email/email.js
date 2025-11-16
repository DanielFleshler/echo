const brevo = require("@getbrevo/brevo");
const logger = require("../logger");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
	brevo.TransactionalEmailsApiApiKeys.apiKey,
	process.env.BREVO_API_KEY
);

const sendEmail = async (options) => {
	try {
		logger.info(`Attempting to send email to: ${options.email}`);
		logger.info(`Brevo API Key exists: ${!!process.env.BREVO_API_KEY}`);

		const sendSmtpEmail = new brevo.SendSmtpEmail();
		sendSmtpEmail.to = [{ email: options.email }];
		sendSmtpEmail.subject = options.subject;
		sendSmtpEmail.htmlContent = options.message;
		sendSmtpEmail.sender = {
			name: "Echo",
			email: process.env.BREVO_SENDER_EMAIL || "echoscoialapp@gmail.com",
		};

		logger.info(`Sending email from: ${sendSmtpEmail.sender.email}`);
		const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
		logger.info(`Email sent successfully to ${options.email}`);
		return result;
	} catch (error) {
		logger.error("Email sending failed:", {
			message: error.message,
			status: error.status,
			response: error.response?.body || error.response?.text || 'No response body',
			code: error.code,
		});
		throw error;
	}
};

module.exports = sendEmail; 