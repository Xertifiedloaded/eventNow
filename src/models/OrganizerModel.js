
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OrganizerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, 
  createdAt: { type: Date, default: Date.now },
});

OrganizerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.Organizer || mongoose.model('Organizer', OrganizerSchema);