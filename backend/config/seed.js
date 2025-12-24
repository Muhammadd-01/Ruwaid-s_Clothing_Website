import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

// Brand data
const brandsData = [
    {
        name: 'J.',
        description: 'J. (Junaid Jamshed) is one of Pakistan\'s leading fashion brands, known for premium quality clothing and traditional Pakistani wear.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    },
    {
        name: 'Bonanza',
        description: 'Bonanza Satrangi offers trendy and affordable fashion with a wide range of casual and formal wear for all occasions.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    },
    {
        name: 'Alkaram',
        description: 'Alkaram Studio is renowned for its premium quality fabrics and contemporary designs, offering both unstitched and ready-to-wear collections.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    },
    {
        name: 'Khaadi',
        description: 'Khaadi is a Pakistani fashion brand famous for its handwoven fabrics and fusion of traditional and modern designs.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    },
    {
        name: 'Gul Ahmed',
        description: 'Gul Ahmed is one of the oldest and most trusted textile brands in Pakistan, offering premium quality fabrics and ready-to-wear clothing.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    },
    {
        name: 'Sana Safinaz',
        description: 'Sana Safinaz is a luxury fashion house known for its elegant designs and high-quality fabrics, perfect for formal occasions.',
        logo: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200'
    }
];

// Category data
const categoriesData = [
    {
        name: 'Men',
        description: 'Stylish and comfortable clothing for men including kurtas, shalwar kameez, and casual wear.',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500'
    },
    {
        name: 'Women',
        description: 'Elegant and trendy clothing for women including suits, lawn collections, and formal wear.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500'
    },
    {
        name: 'Kids',
        description: 'Adorable and comfortable clothing for kids including festive wear and casual outfits.',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500'
    },
    {
        name: 'Formal',
        description: 'Premium formal wear for special occasions, weddings, and professional settings.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'
    },
    {
        name: 'Casual',
        description: 'Everyday casual wear that combines comfort with style for any occasion.',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500'
    },
    {
        name: 'Traditional',
        description: 'Traditional Pakistani clothing including embroidered kurtas, sherwanis, and cultural attire.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'
    }
];

// Product images (organized by type)
const productImages = {
    menKurta: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'
    ],
    menCasual: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'
    ],
    womenSuit: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'
    ],
    womenCasual: [
        'https://images.unsplash.com/photo-1485968579169-a6b5e3ece3b6?w=600',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600'
    ],
    formal: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600'
    ],
    kids: [
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600'
    ]
};

const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Olive Green', hex: '#556B2F' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Burgundy', hex: '#722F37' },
    { name: 'Cream', hex: '#FFFDD0' }
];

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

// Generate products function
const generateProducts = (brands, categories) => {
    const products = [];

    const brandMap = {};
    brands.forEach(b => brandMap[b.name] = b._id);

    const categoryMap = {};
    categories.forEach(c => categoryMap[c.name] = c._id);

    // J. Products
    products.push(
        {
            name: 'J. Premium Embroidered Kurta',
            description: 'Exquisite embroidered kurta crafted from premium cotton fabric. Features intricate thread work on the neckline and sleeves. Perfect for formal occasions and festive celebrations.',
            price: 4500,
            comparePrice: 5500,
            images: productImages.menKurta,
            brand: brandMap['J.'],
            category: categoryMap['Men'],
            sizes: sizes,
            colors: [colors[0], colors[2], colors[4]],
            stock: 50,
            featured: true
        },
        {
            name: 'J. Classic Shalwar Kameez Set',
            description: 'Traditional shalwar kameez set made from high-quality lawn fabric. Comfortable fit with modern styling suitable for everyday wear.',
            price: 3200,
            comparePrice: 4000,
            images: productImages.menCasual,
            brand: brandMap['J.'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[1], colors[5], colors[6]],
            stock: 75
        },
        {
            name: 'J. Women Luxury Lawn Suit',
            description: 'Stunning 3-piece lawn suit featuring digital print with embroidered patches. Includes shirt, trouser, and matching dupatta.',
            price: 5800,
            comparePrice: 7200,
            images: productImages.womenSuit,
            brand: brandMap['J.'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[7], colors[8], colors[9]],
            stock: 40,
            featured: true
        }
    );

    // Bonanza Products
    products.push(
        {
            name: 'Bonanza Satrangi Cotton Kurta',
            description: 'Comfortable cotton kurta with contemporary design. Features subtle embroidery and a relaxed fit perfect for daily wear.',
            price: 2800,
            comparePrice: 3500,
            images: productImages.menKurta,
            brand: brandMap['Bonanza'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[0], colors[6], colors[4]],
            stock: 100
        },
        {
            name: 'Bonanza Festive Collection Kurta',
            description: 'Elegant festive kurta with gold embroidery work. Made from premium fabric with attention to detail and craftsmanship.',
            price: 4200,
            comparePrice: 5000,
            images: productImages.formal,
            brand: brandMap['Bonanza'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[0], colors[3], colors[2]],
            stock: 35,
            featured: true
        },
        {
            name: 'Bonanza Women Printed Suit',
            description: 'Beautiful printed 2-piece suit perfect for casual outings. Lightweight fabric with vibrant colors.',
            price: 2500,
            comparePrice: 3200,
            images: productImages.womenCasual,
            brand: brandMap['Bonanza'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[7], colors[5], colors[9]],
            stock: 60
        }
    );

    // Alkaram Products
    products.push(
        {
            name: 'Alkaram Men Premium Kurta',
            description: 'Premium quality kurta from Alkaram Studio. Features fine cotton fabric with subtle design elements perfect for modern men.',
            price: 3800,
            comparePrice: 4500,
            images: productImages.menKurta,
            brand: brandMap['Alkaram'],
            category: categoryMap['Men'],
            sizes: sizes,
            colors: [colors[1], colors[2], colors[6]],
            stock: 55
        },
        {
            name: 'Alkaram Festive Lawn Collection',
            description: 'Exclusive festive lawn collection featuring intricate embroidery and premium fabric. A must-have for special occasions.',
            price: 6500,
            comparePrice: 8000,
            images: productImages.womenSuit,
            brand: brandMap['Alkaram'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[8], colors[3], colors[7]],
            stock: 30,
            featured: true
        },
        {
            name: 'Alkaram Kids Eid Collection',
            description: 'Adorable Eid collection for kids featuring comfortable fabric and festive designs. Perfect for little ones to celebrate in style.',
            price: 2200,
            comparePrice: 2800,
            images: productImages.kids,
            brand: brandMap['Alkaram'],
            category: categoryMap['Kids'],
            sizes: ['S', 'M', 'L'],
            colors: [colors[1], colors[7], colors[5]],
            stock: 45
        }
    );

    // Khaadi Products
    products.push(
        {
            name: 'Khaadi Handwoven Cotton Kurta',
            description: 'Signature Khaadi handwoven kurta made from pure cotton. Features traditional weaving techniques with modern styling.',
            price: 4000,
            comparePrice: 4800,
            images: productImages.menKurta,
            brand: brandMap['Khaadi'],
            category: categoryMap['Traditional'],
            sizes: sizes,
            colors: [colors[4], colors[5], colors[0]],
            stock: 40,
            featured: true
        },
        {
            name: 'Khaadi Women Fusion Wear',
            description: 'Contemporary fusion wear combining traditional Khaadi craftsmanship with modern design. Perfect for the modern woman.',
            price: 5200,
            comparePrice: 6500,
            images: productImages.womenCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[9], colors[3], colors[7]],
            stock: 35
        },
        {
            name: 'Khaadi Pret Collection Top',
            description: 'Stylish pret top from Khaadi featuring unique prints and comfortable fit. Versatile piece for casual and semi-formal occasions.',
            price: 2800,
            comparePrice: 3500,
            images: productImages.womenCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[1], colors[6], colors[8]],
            stock: 70
        }
    );

    // Gul Ahmed Products
    products.push(
        {
            name: 'Gul Ahmed Men Formal Kurta',
            description: 'Elegant formal kurta from Gul Ahmed\'s premium collection. Made from finest fabric with impeccable stitching.',
            price: 4800,
            comparePrice: 5800,
            images: productImages.formal,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[0], colors[2], colors[3]],
            stock: 25,
            featured: true
        },
        {
            name: 'Gul Ahmed Lawn 3PC Suit',
            description: 'Premium 3-piece lawn suit featuring exclusive prints and embroidered details. Complete set with dupatta.',
            price: 5500,
            comparePrice: 6800,
            images: productImages.womenSuit,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[7], colors[9], colors[5]],
            stock: 45
        },
        {
            name: 'Gul Ahmed Basic Tee Collection',
            description: 'Premium quality basic t-shirts in solid colors. Made from soft cotton for everyday comfort.',
            price: 1500,
            comparePrice: 2000,
            images: productImages.menCasual,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[0], colors[1], colors[2], colors[6]],
            stock: 150
        }
    );

    // Sana Safinaz Products
    products.push(
        {
            name: 'Sana Safinaz Luxury Formals',
            description: 'Exquisite luxury formal wear from Sana Safinaz. Features heavy embroidery and premium chiffon fabric.',
            price: 12000,
            comparePrice: 15000,
            images: productImages.formal,
            brand: brandMap['Sana Safinaz'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[8], colors[0], colors[3]],
            stock: 15,
            featured: true
        },
        {
            name: 'Sana Safinaz Pret Kurta',
            description: 'Ready-to-wear kurta from Sana Safinaz featuring elegant design and comfortable fit.',
            price: 6800,
            comparePrice: 8500,
            images: productImages.womenCasual,
            brand: brandMap['Sana Safinaz'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[7], colors[5], colors[9]],
            stock: 30
        },
        {
            name: 'Sana Safinaz Bridal Collection',
            description: 'Stunning bridal collection piece featuring intricate zardozi work and premium fabric. Perfect for wedding celebrations.',
            price: 25000,
            comparePrice: 32000,
            images: productImages.formal,
            brand: brandMap['Sana Safinaz'],
            category: categoryMap['Traditional'],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [colors[3], colors[8], colors[0]],
            stock: 10,
            featured: true
        }
    );

    // Additional products to reach 50+
    const additionalProducts = [
        {
            name: 'Classic Cotton Polo Shirt',
            description: 'Timeless polo shirt made from premium cotton. Features a classic fit and durable construction.',
            price: 2200,
            comparePrice: 2800,
            images: productImages.menCasual,
            brand: brandMap['Bonanza'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[0], colors[1], colors[2]],
            stock: 80
        },
        {
            name: 'Embroidered Sherwani',
            description: 'Luxurious sherwani with gold embroidery. Perfect for weddings and special occasions.',
            price: 18000,
            comparePrice: 22000,
            images: productImages.formal,
            brand: brandMap['J.'],
            category: categoryMap['Traditional'],
            sizes: sizes,
            colors: [colors[0], colors[3], colors[8]],
            stock: 20,
            featured: true
        },
        {
            name: 'Casual Denim Shirt',
            description: 'Stylish denim shirt with modern fit. Versatile piece for casual outings.',
            price: 2500,
            comparePrice: 3200,
            images: productImages.menCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[2], colors[6]],
            stock: 65
        },
        {
            name: 'Summer Lawn Kurti',
            description: 'Light and breezy lawn kurti perfect for summer. Features floral prints and comfortable cut.',
            price: 1800,
            comparePrice: 2400,
            images: productImages.womenCasual,
            brand: brandMap['Alkaram'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[5], colors[7], colors[9]],
            stock: 90
        },
        {
            name: 'Kids Party Wear Set',
            description: 'Adorable party wear set for kids. Includes kurta and pajama with festive details.',
            price: 2800,
            comparePrice: 3500,
            images: productImages.kids,
            brand: brandMap['Bonanza'],
            category: categoryMap['Kids'],
            sizes: ['S', 'M', 'L'],
            colors: [colors[0], colors[3], colors[7]],
            stock: 40
        },
        {
            name: 'Linen Blend Kurta',
            description: 'Premium linen blend kurta with minimalist design. Perfect for formal and casual settings.',
            price: 3500,
            comparePrice: 4200,
            images: productImages.menKurta,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Men'],
            sizes: sizes,
            colors: [colors[1], colors[5], colors[6]],
            stock: 55
        },
        {
            name: 'Designer Palazzo Set',
            description: 'Trendy palazzo set with printed kurta. Modern silhouette with traditional touches.',
            price: 3800,
            comparePrice: 4800,
            images: productImages.womenCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[7], colors[9], colors[5]],
            stock: 45
        },
        {
            name: 'Formal Waistcoat',
            description: 'Elegant formal waistcoat perfect for layering. Features premium fabric and tailored fit.',
            price: 3200,
            comparePrice: 4000,
            images: productImages.formal,
            brand: brandMap['J.'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[0], colors[2], colors[6]],
            stock: 35
        },
        {
            name: 'Chiffon Dupatta',
            description: 'Elegant chiffon dupatta with embroidered borders. Perfect accessory for any outfit.',
            price: 1500,
            comparePrice: 2000,
            images: productImages.womenSuit,
            brand: brandMap['Sana Safinaz'],
            category: categoryMap['Women'],
            sizes: ['Free Size'],
            colors: [colors[8], colors[3], colors[7]],
            stock: 100
        },
        {
            name: 'Boys Casual Kurta',
            description: 'Comfortable casual kurta for boys. Made from soft cotton with playful design.',
            price: 1600,
            comparePrice: 2000,
            images: productImages.kids,
            brand: brandMap['Alkaram'],
            category: categoryMap['Kids'],
            sizes: ['S', 'M', 'L'],
            colors: [colors[2], colors[4], colors[6]],
            stock: 60
        },
        {
            name: 'Cotton Track Pants',
            description: 'Comfortable cotton track pants for casual wear. Features elastic waist and relaxed fit.',
            price: 1800,
            comparePrice: 2200,
            images: productImages.menCasual,
            brand: brandMap['Bonanza'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[0], colors[6], colors[2]],
            stock: 85
        },
        {
            name: 'Printed Lawn Unstitched',
            description: '3-piece unstitched lawn suit with printed design. Includes shirt, trouser, and dupatta fabric.',
            price: 4200,
            comparePrice: 5200,
            images: productImages.womenSuit,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Women'],
            sizes: ['Free Size'],
            colors: [colors[7], colors[5], colors[9]],
            stock: 50
        },
        {
            name: 'Velvet Shawl',
            description: 'Luxurious velvet shawl with embroidered motifs. Perfect for winter occasions.',
            price: 4500,
            comparePrice: 5500,
            images: productImages.womenSuit,
            brand: brandMap['Sana Safinaz'],
            category: categoryMap['Traditional'],
            sizes: ['Free Size'],
            colors: [colors[3], colors[8], colors[0]],
            stock: 25
        },
        {
            name: 'Printed T-Shirt',
            description: 'Trendy printed t-shirt with graphic design. Made from soft cotton blend.',
            price: 1200,
            comparePrice: 1500,
            images: productImages.menCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[1], colors[0], colors[6]],
            stock: 120
        },
        {
            name: 'Girls Festive Frock',
            description: 'Beautiful festive frock for girls. Features embroidery and net detailing.',
            price: 2400,
            comparePrice: 3000,
            images: productImages.kids,
            brand: brandMap['J.'],
            category: categoryMap['Kids'],
            sizes: ['S', 'M', 'L'],
            colors: [colors[3], colors[7], colors[9]],
            stock: 35
        },
        {
            name: 'Formal Dress Pants',
            description: 'Tailored formal dress pants with premium finish. Perfect for professional settings.',
            price: 2800,
            comparePrice: 3500,
            images: productImages.formal,
            brand: brandMap['Gul Ahmed'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[0], colors[2], colors[6]],
            stock: 70
        },
        {
            name: 'Embroidered Kurti',
            description: 'Beautiful embroidered kurti with thread work details. Versatile piece for various occasions.',
            price: 2600,
            comparePrice: 3200,
            images: productImages.womenCasual,
            brand: brandMap['Bonanza'],
            category: categoryMap['Women'],
            sizes: sizes,
            colors: [colors[5], colors[8], colors[7]],
            stock: 55
        },
        {
            name: 'Winter Wool Coat',
            description: 'Warm wool blend coat for winter season. Features classic design with modern fit.',
            price: 8500,
            comparePrice: 10000,
            images: productImages.formal,
            brand: brandMap['Alkaram'],
            category: categoryMap['Formal'],
            sizes: sizes,
            colors: [colors[0], colors[6], colors[3]],
            stock: 20
        },
        {
            name: 'Casual Printed Shirt',
            description: 'Stylish printed casual shirt with relaxed fit. Perfect for weekend outings.',
            price: 2000,
            comparePrice: 2600,
            images: productImages.menCasual,
            brand: brandMap['Khaadi'],
            category: categoryMap['Casual'],
            sizes: sizes,
            colors: [colors[1], colors[7], colors[5]],
            stock: 75
        },
        {
            name: 'Traditional Ajrak Kurta',
            description: 'Authentic Ajrak printed kurta celebrating Pakistani heritage. Made from pure cotton.',
            price: 3200,
            comparePrice: 4000,
            images: productImages.menKurta,
            brand: brandMap['J.'],
            category: categoryMap['Traditional'],
            sizes: sizes,
            colors: [colors[2], colors[3], colors[0]],
            stock: 30
        }
    ];

    return [...products, ...additionalProducts];
};

// Create Super Admin
const createSuperAdmin = async () => {
    try {
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });

        if (existingSuperAdmin) {
            console.log('ℹ️  Super Admin already exists');
            return existingSuperAdmin;
        }

        const superAdmin = await User.create({
            name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@ruwaids.com',
            password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
            role: 'superadmin',
            phone: '+92 300 0000000'
        });

        console.log('✅ Super Admin created successfully');
        return superAdmin;
    } catch (error) {
        console.error('❌ Error creating Super Admin:', error.message);
        throw error;
    }
};

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Check if data already exists
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            console.log('ℹ️  Database already has products. Skipping seed...');
            return;
        }

        // Clear existing data
        await Brand.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Helper to generate slugs
        const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Create brands with slugs
        const brandsWithSlugs = brandsData.map(brand => ({
            ...brand,
            slug: slugify(brand.name)
        }));
        const brands = await Brand.insertMany(brandsWithSlugs);
        console.log(`✅ Created ${brands.length} brands`);

        // Create categories with slugs
        const categoriesWithSlugs = categoriesData.map(category => ({
            ...category,
            slug: slugify(category.name)
        }));
        const categories = await Category.insertMany(categoriesWithSlugs);
        console.log(`✅ Created ${categories.length} categories`);

        // Generate and create products
        const productsData = generateProducts(brands, categories);
        const products = await Product.insertMany(productsData);
        console.log(`✅ Created ${products.length} products`);

        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    }
};

// Main execution
const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        await createSuperAdmin();
        await seedDatabase();

        console.log('✨ All seeding operations completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

export { seedDatabase, createSuperAdmin };

// Run if called directly
if (process.argv[1].includes('seed.js')) {
    runSeed();
}
