  import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
  import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
  import { Document, Schema as MongooseSchema } from 'mongoose';
  import { Salary } from './salary.schema';
  import { DailyWork } from './daily-work.schema';

  export enum Role {
    Owner = 'Owner',
    Employee = 'Employee'
  }

  registerEnumType(Role, {
    name: 'Role',
    description: 'User roles',
  });

  @ObjectType()
  @Schema({ timestamps: true })
  export class Employee extends Document {
    @Field(() => ID)
    _id: string;

    @Field()
    @Prop({ required: true })
    name: string;

    @Field()
    @Prop({ required: true, unique: true })
    email: string;

    @Field(() => Role)
    @Prop({ required: true, enum: Role })
    role: Role;

    @Prop({ required: true })
    hashed_password: string;

    @Field(() => [Salary], { nullable: true })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Salary' }] })
    salaries: MongooseSchema.Types.ObjectId[] | Salary[];

    @Field(() => [DailyWork], { nullable: true })
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'DailyWork' }] })
    dailyWorks: MongooseSchema.Types.ObjectId[] | DailyWork[];
  }

  export const EmployeeSchema = SchemaFactory.createForClass(Employee);