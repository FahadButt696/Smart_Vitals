# Email Setup Guide for Smart Vitals Contact Form

This guide will help you set up the email functionality for the contact form using Gmail and Nodemailer.

## Prerequisites

1. A Gmail account
2. Access to your Gmail account settings
3. Node.js and npm installed

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

## Step 2: Generate App Password

1. In your Google Account settings, go to Security
2. Find "2-Step Verification" and click on it
3. Scroll down to "App passwords"
4. Click "App passwords"
5. Select "Mail" as the app and "Other" as the device
6. Click "Generate"
7. Copy the generated 16-character password (it will look like: xxxx xxxx xxxx xxxx)

## Step 3: Update Environment Variables

1. In your `Smart_Vitals/Backend` directory, create a `.env` file (if it doesn't exist)
2. Add the following variables:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

**Important Notes:**
- Replace `your_gmail_address@gmail.com` with your actual Gmail address
- Replace `your_16_character_app_password` with the app password generated in Step 2
- Do NOT use your regular Gmail password
- Do NOT commit the `.env` file to version control

## Step 4: Test the Setup

1. Start your backend server:
   ```bash
   cd Smart_Vitals/Backend
   npm run dev
   ```

2. Test the email health check endpoint:
   ```bash
   curl http://localhost:5000/api/contact/health
   ```

3. You should see a response like:
   ```json
   {
     "success": true,
     "message": "Email service is working correctly"
   }
   ```

## Step 5: Test the Contact Form

1. Start your frontend application
2. Navigate to the Contact page
3. Fill out the contact form
4. Submit the form
5. Check your email (zaynabfatyma2@gmail.com) for the new message

## Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Make sure you're using the app password, not your regular Gmail password
   - Ensure 2-factor authentication is enabled

2. **"Less secure app access" error:**
   - This is expected and normal with app passwords
   - App passwords are designed for this use case

3. **Email not received:**
   - Check your spam folder
   - Verify the email address in the controller matches your email
   - Check the backend console for any error messages

4. **CORS errors:**
   - Ensure your backend CORS configuration includes your frontend URL
   - Check that the frontend is making requests to the correct backend URL

### Security Best Practices:

1. **Never commit `.env` files to version control**
2. **Use app passwords instead of regular passwords**
3. **Regularly rotate your app passwords**
4. **Monitor your Gmail account for suspicious activity**

## API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/contact/health` - Check email service status

## Contact Form Data Structure

```json
{
  "name": "User's Name",
  "email": "user@example.com",
  "message": "User's message content"
}
```

## Email Template

The contact form sends a professionally formatted HTML email with:
- Contact information (name, email)
- User's message
- Timestamp
- Smart Vitals branding

## Support

If you encounter any issues:
1. Check the backend console for error messages
2. Verify your environment variables
3. Test the health check endpoint
4. Ensure your Gmail account settings are correct
