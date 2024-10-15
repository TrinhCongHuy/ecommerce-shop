import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auths/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default: [Role.User],
  })
  role: Role[];

  _id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
