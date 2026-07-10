const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const { connectDB, getIsLocalDB, setIsLocalDB } = require('../src/config/db');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

// Verify database path if in local mode
const dbPath = path.join(__dirname, 'db.json');

const sampleProducts = [
  {
    name: 'Aura Sound Max Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Experience pure audio bliss with Aura Sound Max. Features Active Noise Cancellation, high-fidelity spatial audio, 40-hour battery life, and ultra-comfortable memory foam ear cushions.',
    brand: 'Aura',
    category: 'Audio',
    price: 199.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 4,
    reviews: [
      { name: 'Alice Smith', rating: 5, comment: 'Absolutely amazing sound! The active noise cancellation is top notch.' },
      { name: 'Bob Johnson', rating: 4, comment: 'Very comfortable for long working hours. Highs and mids are great.' },
      { name: 'Charlie Davis', rating: 5, comment: 'Battery life is unbelievable. Easily lasts for a full week.' },
      { name: 'David Miller', rating: 5, comment: 'Premium feel and clean design. Totally worth the money.' }
    ]
  },
  {
    name: 'Chronos Watch S',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'A premium smart wearable tracking your heart rate, sleep cycles, blood oxygen levels, and workouts. Equipped with a brilliant curved AMOLED always-on display and up to 10 days of battery life.',
    brand: 'Chronos',
    category: 'Wearables',
    price: 249.99,
    countInStock: 8,
    rating: 4.5,
    numReviews: 2,
    reviews: [
      { name: 'Emma Wilson', rating: 5, comment: 'Best smart watch I have owned. Sleep tracking is incredibly accurate.' },
      { name: 'Frank Harris', rating: 4, comment: 'Looks beautiful and has nice faces, but notification sync can lag occasionally.' }
    ]
  },
  {
    name: 'Keeb Vibe Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'An enthusiast-grade mechanical keyboard featuring hot-swappable tactile linear switches, double-shot PBT custom keycaps, robust aluminum casing, and pre-lubed stabilizers with dynamic per-key RGB backlighting.',
    brand: 'KeebVibe',
    category: 'Accessories',
    price: 129.99,
    countInStock: 20,
    rating: 4.7,
    numReviews: 3,
    reviews: [
      { name: 'Grace Lee', rating: 5, comment: 'The sound profile is marvelous! Out of the box, it is super thocky.' },
      { name: 'Henry Clark', rating: 4, comment: 'Solid build quality. Software is a bit clunky, but keyboard works flawlessly.' },
      { name: 'Ivy Lewis', rating: 5, comment: 'Typing on this is pure joy. Best keyboard I have ever owned!' }
    ]
  },
  {
    name: 'Apex Ergo Lumbar Chair',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80',
    description: 'Reclaim your comfort with the Apex Ergo. Designed with adaptive automatic lumbar support, 3D adjustable armrests, premium high-elasticity mesh backing, and multi-angle reclining lock states.',
    brand: 'Apex',
    category: 'Furniture',
    price: 349.99,
    countInStock: 4,
    rating: 4.6,
    numReviews: 3,
    reviews: [
      { name: 'Jack Martin', rating: 5, comment: 'No more back pain after 8 hours of coding. Fantastic ergonomic adjustments.' },
      { name: 'Karen Wright', rating: 4, comment: 'Sturdy and heavy. Assembly took about 30 minutes, but it is extremely comfortable.' },
      { name: 'Leo Scott', rating: 5, comment: 'Brilliant mesh quality. Keeps me cool during hot summer days.' }
    ]
  },
  {
    name: 'Helios Smart Ring',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    description: 'Advanced health tracking packed into a premium titanium ring. Tracks sleep stages, heart rate variability, and body temperature with 7-day battery life.',
    brand: 'Helios',
    category: 'Wearables',
    price: 299.99,
    countInStock: 12,
    rating: 4.6,
    numReviews: 3,
    reviews: [
      { name: 'Mia Young', rating: 5, comment: 'So much more comfortable to sleep with than a watch!' },
      { name: 'Noah Allen', rating: 4, comment: 'App gives great insights, though resizing process was tedious.' },
      { name: 'Olivia Adams', rating: 5, comment: 'Looks just like a regular ring but holds incredible tech.' }
    ]
  },
  {
    name: 'Nomad Tech Backpack 25L',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Designed for modern tech nomads. Featuring water-repellent Cordura fabric, a padded lay-flat laptop compartment fitting up to 16-inch laptops, hidden security pockets, and magnetic chest straps.',
    brand: 'Nomad',
    category: 'Travel',
    price: 89.99,
    countInStock: 12,
    rating: 4.8,
    numReviews: 2,
    reviews: [
      { name: 'Paul Baker', rating: 5, comment: 'Tons of compartments, amazing design. Extremely comfortable straps.' },
      { name: 'Quinn Nelson', rating: 4, comment: 'Great materials. A bit stiff at first, but breaks in nicely.' }
    ]
  },
  {
    name: 'Lumi Aurora Ambience Lamp',
    image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=600&auto=format&fit=crop&q=80',
    description: 'Bring dynamic color to your setup. A smart ambient light projecting over 16 million colors, syncing to screen colors or music rhythms. Controllable via mobile application, Google Home, and Alexa.',
    brand: 'Lumi',
    category: 'Lifestyle',
    price: 69.99,
    countInStock: 2,
    rating: 4.2,
    numReviews: 2,
    reviews: [
      { name: 'Ruby Carter', rating: 4, comment: 'Very bright and color sync mode is cool for watching movies.' },
      { name: 'Samuel Perez', rating: 4, comment: 'Good quality, but app interface can be slightly confusing to connect to Wi-Fi.' }
    ]
  },
  {
    name: 'Ember Smart Thermal Mug V2',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Never drink cold coffee again. This smart, temperature-controlled ceramic thermal mug keeps your beverage at your exact preferred temperature (120°F - 145°F) for up to 80 minutes or all day on the charging coaster.',
    brand: 'Ember',
    category: 'Lifestyle',
    price: 119.99,
    countInStock: 18,
    rating: 4.6,
    numReviews: 3,
    reviews: [
      { name: 'Tyler Ross', rating: 5, comment: 'A luxury item, but if you sit at a desk all day drinking tea or coffee, it is a game changer.' },
      { name: 'Victoria Wood', rating: 4, comment: 'Keeps drink perfectly hot. Battery life without the coaster is a bit short.' },
      { name: 'Wyatt Ward', rating: 5, comment: 'Perfect gift for office workers. Software works great.' }
    ]
  },
  {
    name: 'Nebula X 4K Camera Drone',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&auto=format&fit=crop&q=80',
    description: 'Capture breathtaking landscapes with the Nebula X. Equipped with a 4K UHD Hasselblad camera, omnidirectional obstacle sensing, and a 46-minute max flight time.',
    brand: 'Nebula',
    category: 'Electronics',
    price: 899.99,
    countInStock: 5,
    rating: 4.9,
    numReviews: 2,
    reviews: [
      { name: 'Evan Scott', rating: 5, comment: 'The video quality is out of this world. Highly responsive controls.' },
      { name: 'Fiona Ray', rating: 5, comment: 'Incredible range and the obstacle sensing saved my drone twice already!' }
    ]
  },
  {
    name: 'Zenith Pro Creator Laptop',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&auto=format&fit=crop&q=80',
    description: 'Power through your creative workflows. Features an M2 Max processor, 64GB of unified memory, and a stunning 16-inch mini-LED display for true HDR.',
    brand: 'Zenith',
    category: 'Electronics',
    price: 2499.99,
    countInStock: 8,
    rating: 4.9,
    numReviews: 4,
    reviews: [
      { name: 'Gary Chen', rating: 5, comment: 'Handles 8K video timelines without breaking a sweat.' },
      { name: 'Hannah Lee', rating: 5, comment: 'The display is absolutely gorgeous for color grading.' }
    ]
  },
  {
    name: 'Nova Studio Monitor Speaker',
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=600&auto=format&fit=crop&q=80',
    description: 'Reference-grade audio reproduction for serious producers. Features an 8-inch Kevlar woofer, silk dome tweeter, and bi-amped Class-D amplification.',
    brand: 'Nova',
    category: 'Audio',
    price: 349.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 3,
    reviews: [
      { name: 'Ian Brooks', rating: 5, comment: 'Incredibly flat response, just what I needed for mixing.' },
      { name: 'Jessica Wong', rating: 5, comment: 'Built like a tank and sounds phenomenal.' },
      { name: 'Kevin Grant', rating: 4, comment: 'A bit heavy, but the soundstage is massive.' }
    ]
  },
  {
    name: 'EcoBrew Smart Coffee Maker',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop&q=80',
    description: 'Start your morning right. A Wi-Fi enabled drip coffee maker featuring precision temperature control, built-in conical burr grinder, and scheduling via app.',
    brand: 'EcoBrew',
    category: 'Lifestyle',
    price: 299.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 2,
    reviews: [
      { name: 'Laura Bailey', rating: 5, comment: 'Waking up to freshly ground, perfectly brewed coffee is amazing.' },
      { name: 'Mike Johnson', rating: 4, comment: 'Makes great coffee. The grinder can be a little loud though.' }
    ]
  }
];

const seedDB = async () => {
  try {
    // Attempt DB connection
    const connectionResult = await connectDB();
    const isLocal = connectionResult.isLocalDB;

    // Password hashes
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('adminpassword123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    const adminUser = {
      name: 'Admin User',
      email: 'admin@shopsphere.com',
      password: adminPassword,
      isAdmin: true
    };

    const regularUser = {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: userPassword,
      isAdmin: false
    };

    if (isLocal) {
      console.log('🌱 Seeding Local JSON file...');

      adminUser._id = 'user_admin_0000000000000';
      adminUser.createdAt = new Date().toISOString();
      adminUser.updatedAt = new Date().toISOString();

      regularUser._id = 'user_buyer_0000000000000';
      regularUser.createdAt = new Date().toISOString();
      regularUser.updatedAt = new Date().toISOString();

      // Seed Reviews with proper ID references for local
      const productsToSeed = sampleProducts.map((prod, index) => {
        const prodId = `prod_${index + 1}_0000000000000`;
        const updatedReviews = prod.reviews.map((rev, revIdx) => ({
          _id: `rev_${prodId}_${revIdx}`,
          name: rev.name,
          rating: rev.rating,
          comment: rev.comment,
          user: regularUser._id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

        return {
          _id: prodId,
          name: prod.name,
          image: prod.image,
          description: prod.description,
          brand: prod.brand,
          category: prod.category,
          price: prod.price,
          countInStock: prod.countInStock,
          rating: prod.rating,
          numReviews: prod.numReviews,
          reviews: updatedReviews,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      // Sample mock orders
      const sampleOrders = [
        {
          _id: 'order_1_0000000000000',
          user: regularUser._id,
          orderItems: [
            {
              _id: 'order_item_1',
              name: productsToSeed[0].name,
              qty: 1,
              image: productsToSeed[0].image,
              price: productsToSeed[0].price,
              product: productsToSeed[0]._id
            },
            {
              _id: 'order_item_2',
              name: productsToSeed[2].name,
              qty: 2,
              image: productsToSeed[2].image,
              price: productsToSeed[2].price,
              product: productsToSeed[2]._id
            }
          ],
          shippingAddress: {
            address: '123 Tech Lane',
            city: 'Silicon Valley',
            postalCode: '94025',
            country: 'USA'
          },
          paymentMethod: 'Stripe',
          paymentResult: {
            id: 'ch_mock_123456',
            status: 'succeeded',
            update_time: new Date().toISOString(),
            email_address: regularUser.email
          },
          itemsPrice: productsToSeed[0].price + (productsToSeed[2].price * 2),
          shippingPrice: 0.00,
          taxPrice: 38.99,
          totalPrice: productsToSeed[0].price + (productsToSeed[2].price * 2) + 38.99,
          isPaid: true,
          paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          isDelivered: true,
          deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Delivered',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'order_2_0000000000000',
          user: regularUser._id,
          orderItems: [
            {
              _id: 'order_item_3',
              name: productsToSeed[1].name,
              qty: 1,
              image: productsToSeed[1].image,
              price: productsToSeed[1].price,
              product: productsToSeed[1]._id
            }
          ],
          shippingAddress: {
            address: '456 Cyber Drive',
            city: 'Metropolis',
            postalCode: '10001',
            country: 'USA'
          },
          paymentMethod: 'Stripe',
          paymentResult: {
            id: 'ch_mock_789012',
            status: 'succeeded',
            update_time: new Date().toISOString(),
            email_address: regularUser.email
          },
          itemsPrice: productsToSeed[1].price,
          shippingPrice: 15.00,
          taxPrice: 22.50,
          totalPrice: productsToSeed[1].price + 15.00 + 22.50,
          isPaid: true,
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isDelivered: false,
          status: 'Processing',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Overwrite the local database file directly
      fs.writeFileSync(
        dbPath,
        JSON.stringify(
          {
            users: [adminUser, regularUser],
            products: productsToSeed,
            orders: sampleOrders
          },
          null,
          2
        )
      );

      console.log('✅ Local Database successfully seeded!');
    } else {
      console.log('🌱 Seeding MongoDB Database...');
      
      // Wipe collections
      await User.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
      console.log('🧹 Collections cleared');

      // Create Admin and Regular Users
      const createdAdmin = await User.create(adminUser);
      const createdUser = await User.create(regularUser);

      // Seed Products with reviewer ID
      const productsToSeed = sampleProducts.map((prod) => {
        const reviewsWithUser = prod.reviews.map((rev) => ({
          ...rev,
          user: createdUser._id
        }));
        return {
          ...prod,
          reviews: reviewsWithUser
        };
      });

      const seededProducts = await Product.create(productsToSeed);

      // Seed mock orders
      const order1 = {
        user: createdUser._id,
        orderItems: [
          {
            name: seededProducts[0].name,
            qty: 1,
            image: seededProducts[0].image,
            price: seededProducts[0].price,
            product: seededProducts[0]._id
          },
          {
            name: seededProducts[2].name,
            qty: 2,
            image: seededProducts[2].image,
            price: seededProducts[2].price,
            product: seededProducts[2]._id
          }
        ],
        shippingAddress: {
          address: '123 Tech Lane',
          city: 'Silicon Valley',
          postalCode: '94025',
          country: 'USA'
        },
        paymentMethod: 'Stripe',
        itemsPrice: seededProducts[0].price + (seededProducts[2].price * 2),
        shippingPrice: 0.00,
        taxPrice: 38.99,
        totalPrice: seededProducts[0].price + (seededProducts[2].price * 2) + 38.99,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'Delivered',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      };

      const order2 = {
        user: createdUser._id,
        orderItems: [
          {
            name: seededProducts[1].name,
            qty: 1,
            image: seededProducts[1].image,
            price: seededProducts[1].price,
            product: seededProducts[1]._id
          }
        ],
        shippingAddress: {
          address: '456 Cyber Drive',
          city: 'Metropolis',
          postalCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'Stripe',
        itemsPrice: seededProducts[1].price,
        shippingPrice: 15.00,
        taxPrice: 22.50,
        totalPrice: seededProducts[1].price + 15.00 + 22.50,
        isPaid: true,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isDelivered: false,
        status: 'Processing',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      };

      await Order.create([order1, order2]);

      console.log('✅ MongoDB Database successfully seeded!');
    }

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding script error: ${error.message}`);
    process.exit(1);
  }
};

// Start Seeding
seedDB();
