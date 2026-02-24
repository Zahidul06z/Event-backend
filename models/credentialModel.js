import mongoose from 'mongoose'

const credentialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: { type: String, unique: true, sparse: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin','user'],
    default: 'user'
  },
 
}, {
  timestamps: true
});

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential
