
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OrganizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  paystackPublicKey: {
    type: String,
    unique: true
  },
  createdAt: { type: Date, default: Date.now },
});

OrganizerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);