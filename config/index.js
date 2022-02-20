require('dotenv').config();


export const Secrets = {
	ENVIRONMENT: process.env.NODE_ENV || "local",
	DATABASE_URL: process.env.DATABASE_URL,
	DATABASE_NAME: process.env.DATABASE_NAME,
	JWT_TOKEN: process.env.JWT_TOKEN || "8QSTcgvmQUek2kUd5m_sfpK",
	MAILGUN_KEY: process.env.MAILGUN_KEY,
	MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
	SENDGRID_KEY: process.env.SENDGRID_KEY,
	WEB_BASE_URL: process.env.WEB_BASE_URL || "https://fj-lite.netlify.app",
	EMAIL_USERNAME: process.env.EMAIL_USERNAME || "support@spire.africa",
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "BV**123SPIRE@@^",
	PORT: process.env.PORT || 5000,
	HOST: process.env.HOST || "localhost"
}


