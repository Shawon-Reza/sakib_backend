export const ENV_EXAMPLE = `PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"

# Better Auth
BETTER_AUTH_SECRET="replace-with-a-strong-secret"
BETTER_AUTH_URL="https://your-backend-service.up.railway.app"

# Frontend origins (comma-separated)
CORS_ORIGIN="http://localhost:3000,https://your-frontend-domain.com"
TRUSTED_ORIGINS="http://localhost:3000,https://your-frontend-domain.com"

# Gmail SMTP (use Google App Password, not your regular Gmail password)
SMTP_USER="your-gmail-address@gmail.com"
SMTP_PASS="your-16-char-google-app-password"
`;
