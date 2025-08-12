import nodemailer from 'nodemailer';

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Send contact form email
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Keep authenticated Gmail account as sender
      to: 'zaynabfatyma2@gmail.com', // Your email address
      replyTo: email, // Set reply-to to user's email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Smart Vitals Contact Form</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New message received</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">Contact Information</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${email} (Reply-to address)</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">Message</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                This message was sent from the Smart Vitals contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
              </p>
              <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
                Reply directly to this email to respond to ${name} at ${email}
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contact form. Please try again later.'
    });
  }
};

// Health check for email service
export const emailHealthCheck = async (req, res) => {
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    
    res.status(200).json({
      success: true,
      message: 'Email service is working correctly'
    });
  } catch (error) {
    console.error('Email service health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email service is not working correctly',
      error: error.message
    });
  }
};
