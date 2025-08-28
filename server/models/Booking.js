import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  customerId: {
    type: String,
    required: true,
    trim: true
  },
  fromPincode: {
    type: String,
    required: true
  },
  toPincode: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  estimatedRideDurationHours: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

// Index for efficient time overlap queries
BookingSchema.index({ vehicleId: 1, startTime: 1, endTime: 1 });

export default mongoose.model('Booking', BookingSchema);
