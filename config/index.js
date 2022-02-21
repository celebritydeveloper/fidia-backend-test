require('dotenv').config();


export const Secrets = {
	ENVIRONMENT: process.env.NODE_ENV || "local",
	DATABASE_URL: process.env.DATABASE_URL,
	DATABASE_NAME: process.env.DATABASE_NAME,
	JWT_TOKEN: process.env.JWT_TOKEN || "8QSTcgvmQUek2kUd5m_sfpK",
	WEB_BASE_URL: process.env.WEB_BASE_URL || "https://getfidia.com",
	EMAIL_USERNAME: process.env.EMAIL_USERNAME || "support@getfidia.com",
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "BV**123FIDIA@@^",
	PORT: process.env.PORT || 8080,
	HOST: process.env.HOST || "localhost"
}


