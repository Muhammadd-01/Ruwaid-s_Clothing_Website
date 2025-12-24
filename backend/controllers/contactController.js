import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

// Transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ruwaidclothing@gmail.com',
        // Note: For Gmail, the user will need to generate an "App Password" 
        // if they have 2FA enabled, and put it in their .env file
        pass: process.env.EMAIL_PASSWORD || 'your_app_password_here'
    }
});

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Send actual email
        const mailOptions = {
            from: 'ruwaidclothing@gmail.com',
            to: 'ruwaidclothing@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`📩 Email sent to ruwaidclothing@gmail.com`);
        } catch (emailError) {
            console.error('❌ Email failed to send:', emailError.message);
            // We don't fail the request if email fails, as long as it's saved to DB
        }

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Message sent successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};
