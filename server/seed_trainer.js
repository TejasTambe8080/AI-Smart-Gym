const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: [String],
  experience: Number,
  pricePerSession: Number,
  bio: String,
  imageUrl: String,
  isVerified: { type: Boolean, default: false },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 4.8 }
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', TrainerSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_gym');
    
    const existing = await Trainer.findOne({ email: 'tejas@formfix.ai' });
    if (existing) {
      console.log('Trainer already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    const trainer = new Trainer({
      name: 'Tejas Tambe',
      email: 'tejas@formfix.ai',
      password: hashedPassword,
      specialization: ['Hypertrophy', 'Neural Form', 'Kinetic Linkage'],
      experience: 15,
      pricePerSession: 5000,
      bio: 'Elite performance coach and system architect specializing in the gold standard of biomechanical optimization.',
      imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=800&auto=format&fit=crop',
      isVerified: true
    });

    await trainer.save();
    console.log('Seed successful: Trainer Marcus Aurelius created.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
