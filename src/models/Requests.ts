import mongoose from "../db/conn";
import { Schema, Document } from "mongoose";

interface PrimaryPresence {
  startTime: Date;
  endTime: Date;
  systemPresence: string;
  organizationPresenceId: string;
}

// Definição do schema principal para UserDetails
interface UserDetails {
  userName: string | null;
  userId: string;
  primaryPresence: PrimaryPresence[];
}

// Interface para o documento completo (usando o Mongoose.Document)
interface UserDetailsDocument extends UserDetails, Document { }

// Schema para UserDetails
const UserDetailsSchema = new Schema<UserDetailsDocument>({
  userName: { type: String, default: null },
  userId: { type: String, required: true },
  primaryPresence: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    systemPresence: { type: String, required: true },
    organizationPresenceId: { type: String, required: true }
  }]
});

// Modelo para UserDetails
const Requests = mongoose.model<UserDetailsDocument>('Requests', UserDetailsSchema);

export default Requests
