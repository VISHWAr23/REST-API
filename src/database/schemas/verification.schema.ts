import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Verification extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: Date.now, expires: 3600 }) // Expires in 1 hour
  createdAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
