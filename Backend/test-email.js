import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Test email configuration
const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email App Password:', process.env.EMAIL_APP_PASSWORD ? '***SET***' : 'NOT SET');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('❌ Email environment variables are not set!');
      console.log('Please check your .env file and ensure EMAIL_USER and EMAIL_APP_PASSWORD are set.');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Verify transporter
    console.log('Verifying transporter configuration...');
    await transporter.verify();
    console.log('✅ Transporter configuration is valid');

    // Test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'zaynabfatyma2@gmail.com',
      subject: 'Test Email from Smart Vitals',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email to verify the email functionality is working correctly.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Authentication failed. Please check:');
      console.log('1. Your Gmail address is correct');
      console.log('2. Your app password is correct');
      console.log('3. 2-factor authentication is enabled');
      console.log('4. App password was generated for "Mail" app');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection failed. Please check:');
      console.log('1. Your internet connection');
      console.log('2. Gmail is accessible');
    }
  }
};

// Run the test
testEmail();
