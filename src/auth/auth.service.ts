import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from '../database/schemas/employee.schema';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Employee.name) private employeeModel: Model<Employee>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async login(dto: AuthDto, req : Request, res : Response) {
        const { email, password } = dto;

        const user = await this.employeeModel.findOne({ email: dto.email });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        const isMatch = await this.comparePassword({password, hash: user.hashed_password});

        if (!isMatch) {
            throw new BadRequestException("Wrong Credentials");
        }

        const token = await this.signToken({id : user.id, email: user.email});
        if(!token) {
            new ForbiddenException();
        }

        res.cookie('token', token);

        return res.send({message: 'Login successful'});
    }
    
    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        return res.send({message: 'logged out successfully'});
    }
    
    async register(dto: RegisterDto) {
        if (!dto.password) {
          throw new BadRequestException('Password is required');
        }
    
        const existingUser = await this.employeeModel.findOne({ email: dto.email });
        if (existingUser) {
          throw new BadRequestException('Email already registered');
        }
    
        const hashedPassword = await this.hashPassword(dto.password);
    
        const newEmployee = new this.employeeModel({
          name: dto.name,
          email: dto.email,
          role: dto.role,
          hashed_password: hashedPassword
        });
    
        return await newEmployee.save();
      }

    async hashPassword(password: string): Promise<string> {
        if (!password) {
          throw new BadRequestException('Password is required');
        }
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
      }

    async comparePassword(args : {password:string,hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }

    async signToken(args : {id:string,email:string}) {
        const payload = args;
        const secret = this.configService.get<string>('JWT_SECRET');
        
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }

        return this.jwtService.signAsync(payload, { secret });
    }
}
