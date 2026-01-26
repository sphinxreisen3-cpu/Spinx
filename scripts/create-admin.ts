import { connectDB } from '../lib/db/mongoose';
import { Admin } from '../lib/db/models/admin.model';
import { hashPassword } from '../lib/auth';

async function createAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@mail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists with email: admin@mail.com');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@mail.com',
      password: hashedPassword,
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@mail.com');
    console.log('Password: admin123');
    console.log('\nYou can now log in to the admin panel.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
