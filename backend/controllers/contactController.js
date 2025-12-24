import Contact from '../models/Contact.js';

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

        // In a real application, you would send an email here using implementing Nodemailer
        // For now, we simulate the email sending by logging it
        console.log(`📩 New Contact Message from ${name} (${email}): ${subject}`);
        console.log(`To: ruwaidclothing@gmail.com`);
        console.log(`Message: ${message}`);

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
