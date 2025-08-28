import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true
  },
  capacityKg: {
    type: Number,
    required: [true, 'Vehicle capacity is required'],
    min: [1, 'Capacity must be greater than 0']
  },
  tyres: {
    type: Number,
    required: [true, 'Number of tyres is required'],
    min: [1, 'Tyres must be greater than 0']
  }
}, { timestamps: true });

export default mongoose.model('Vehicle', VehicleSchema);
