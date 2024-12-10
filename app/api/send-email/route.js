import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Spam keywords to check against
const spamKeywords = [
  'buy now',
  'make money fast',
  'winner',
  'lottery',
  'bitcoin',
  'investment opportunity',
  'casino',
];

// Basic profanity list (keep it minimal and clean)
const profanityList = [
  'badword1',
  'badword2',
  // Add more as needed
];

// Check for spam content
const isSpam = (content) => {
  const lowerContent = content.toLowerCase();
  return spamKeywords.some(keyword => lowerContent.includes(keyword.toLowerCase()));
};

// Check for profanity
const containsProfanity = (content) => {
  const lowerContent = content.toLowerCase();
  return profanityList.some(word => lowerContent.includes(word.toLowerCase()));
};

// HTML email template
const createEmailHTML = (name, email, message, trackingId) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">New Portfolio Contact</h2>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
      <p><strong>Reference ID:</strong> ${trackingId}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <h3>Message:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  </div>
`;

// Auto-response template
const createAutoResponseHTML = (name, trackingId) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Thank you for your message!</h2>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
      <p>Dear ${name},</p>
      <p>Thank you for contacting me. I have received your message (Reference ID: ${trackingId}) and will get back to you as soon as possible.</p>
      <p>Best regards,<br/>Lars</p>
    </div>
  </div>
`;

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, message } = data;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate tracking ID
    const trackingId = uuidv4();

    // Check for spam content
    if (isSpam(message)) {
      return NextResponse.json(
        { error: 'Message detected as spam' },
        { status: 400 }
      );
    }

    // Check for profanity
    if (containsProfanity(message)) {
      return NextResponse.json(
        { error: 'Message contains inappropriate content' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Main email content
    const mainMailOptions = {
      from: email,
      to: 'desmetlars5@gmail.com',
      subject: `Portfolio Contact from ${name} [${trackingId}]`,
      text: `Reference ID: ${trackingId}\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: createEmailHTML(name, email, message, trackingId),
      replyTo: email
    };

    // Auto-response email content
    const autoResponseOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your message',
      html: createAutoResponseHTML(name, trackingId)
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mainMailOptions),
      transporter.sendMail(autoResponseOptions)
    ]);

    return NextResponse.json(
      {
        message: 'Email sent successfully',
        trackingId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);

    // More specific error messages
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: 'Email authentication failed. Please check email credentials.' },
        { status: 500 }
      );
    } else if (error.code === 'ESOCKET') {
      return NextResponse.json(
        { error: 'Network error occurred. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
