import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a brand name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Brand name cannot be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    logo: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate slug before saving
brandSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
