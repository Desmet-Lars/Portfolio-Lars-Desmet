import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
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

// Allowed file types for attachments
const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

// Rate limiting setup - 3 emails per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 6,
  message: 'Too many emails sent from this IP, please try again in an hour',
});

// HTML email template with tracking pixel
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
    <img src="/api/track-email?id=${trackingId}" alt="" style="width:1px;height:1px;" />
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
    // Apply rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.ip;
    try {
      await limiter.check(req, clientIP);
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const attachment = formData.get('attachment');

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

    // Handle attachment if present
    let attachments = [];
    if (attachment) {
      if (attachment.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }

      if (!allowedFileTypes.includes(attachment.type)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      const buffer = await attachment.arrayBuffer();
      attachments.push({
        filename: attachment.name,
        content: Buffer.from(buffer),
        contentType: attachment.type
      });
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
      replyTo: email,
      attachments
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
