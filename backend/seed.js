require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./src/models/User.model');
const College = require('./src/models/College.model');
const Event = require('./src/models/Event.model');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await College.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create colleges with college_admin users
    const collegeAdmins = [];
    const colleges = [];
    const collegeData = [
      { name: 'MIT', domain: 'mit.edu' },
      { name: 'Stanford University', domain: 'stanford.edu' },
      { name: 'Harvard University', domain: 'harvard.edu' },
      { name: 'UC Berkeley', domain: 'berkeley.edu' },
      { name: 'Carnegie Mellon University', domain: 'cmu.edu' },
      { name: 'Princeton University', domain: 'princeton.edu' },
    ];

    for (const collegeInfo of collegeData) {
      const adminUser = new User({
        name: `${collegeInfo.name} Admin`,
        email: `admin@${collegeInfo.domain}`,
        password: hashedPassword,
        role: 'college_admin',
        status: 'active',
      });
      const savedAdmin = await adminUser.save();
      collegeAdmins.push(savedAdmin);

      const college = new College({
        name: collegeInfo.name,
        domain: collegeInfo.domain,
        verified: true,
        admin: savedAdmin._id,
      });
      const savedCollege = await college.save();
      colleges.push(savedCollege);

      // Update admin with college reference
      await User.findByIdAndUpdate(savedAdmin._id, { college: savedCollege._id });
    }
    console.log(`✅ Created ${colleges.length} colleges with admins`);

    // Create brand users
    const brands = [];
    const brandNames = ['Nike', 'Apple', 'Microsoft', 'Google', 'Amazon', 'Meta'];
    for (const brandName of brandNames) {
      const brandUser = new User({
        name: brandName,
        email: `${brandName.toLowerCase()}@brand.com`,
        password: hashedPassword,
        role: 'brand',
        status: 'active',
      });
      const savedBrand = await brandUser.save();
      brands.push(savedBrand);
    }
    console.log(`✅ Created ${brands.length} brands`);

    // Create student users
    const students = [];
    const studentNames = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Emma Davis', 'Frank Wilson'];
    for (let i = 0; i < studentNames.length; i++) {
      const studentUser = new User({
        name: studentNames[i],
        email: `student${i + 1}@mit.edu`,
        password: hashedPassword,
        role: 'student',
        status: 'active',
        college: colleges[0]._id, // Assign to MIT
      });
      const savedStudent = await studentUser.save();
      students.push(savedStudent);
    }
    console.log(`✅ Created ${students.length} students`);

    // Create platform admin
    const platformAdmin = new User({
      name: 'Platform Admin',
      email: 'admin@active8.com',
      password: hashedPassword,
      role: 'platform_admin',
      status: 'active',
    });
    await platformAdmin.save();
    console.log('✅ Created platform admin');

    // Create events
    const events = [];
    const eventTitles = [
      'Tech Summit 2026',
      'AI & Machine Learning Conference',
      'Web Development Workshop',
      'Startup Pitch Event',
      'Cloud Computing Masterclass',
      'Digital Marketing Forum',
    ];

    for (let i = 0; i < eventTitles.length; i++) {
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + (i + 1) * 7); // Events 1-6 weeks from now

      const event = new Event({
        title: eventTitles[i],
        description: `Join us for an exclusive ${eventTitles[i]} where industry experts share insights and best practices. Network with peers and explore sponsorship opportunities.`,
        date: eventDate,
        location: `${colleges[Math.floor(i / 2)].name} Campus`,
        footfall: Math.floor(Math.random() * 3000) + 500, // 500-3500 attendees
        status: i % 2 === 0 ? 'published' : 'draft',
        createdBy: students[i % students.length]._id,
      });
      const savedEvent = await event.save();
      events.push(savedEvent);
    }
    console.log(`✅ Created ${events.length} events`);

    console.log('\n📊 Seed Data Summary:');
    console.log(`   - ${colleges.length} Colleges`);
    console.log(`   - ${brands.length} Brands`);
    console.log(`   - ${students.length} Students`);
    console.log(`   - 1 Platform Admin`);
    console.log(`   - ${collegeAdmins.length} College Admins`);
    console.log(`   - ${events.length} Events`);
    console.log('\n✅ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
