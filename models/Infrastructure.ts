import mongoose, { Schema, Document } from 'mongoose';

export interface IInfrastructure extends Document {
  cityId: mongoose.Types.ObjectId;
  districtId?: mongoose.Types.ObjectId;
  type: string;
  name: string;
  address: string;
  geo: {
    lat: number;
    lon: number;
  };
  workingHours?: string;
  photo?: string;
}

const InfrastructureSchema = new Schema<IInfrastructure>({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  type: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  geo: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  workingHours: String,
  photo: String
});

export default mongoose.models.Infrastructure || mongoose.model<IInfrastructure>('Infrastructure', InfrastructureSchema);