import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './utils/constants'

@Injectable()
export class AuthService {

    constructor(private daatabaseService : DatabaseService, private jwtService : JwtService) {}

    async login(dto: AuthDto) {
        const { email, password } = dto;

        const user = await this.daatabaseService.employee.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        const isMatch = await this.comparePassword({password, hash: user.hashed_password});

        if (!isMatch) {
            throw new BadRequestException("Wrong Credentials");
        }

        const token = await this.signToken({id : user.id, email: user.email});

        return { token }
    }
    
    async logout() {
        return 'This action logs a user out';
    }
    
    async register(Dto : Prisma.EmployeeCreateInput) {
        const { email } = Dto;

        const user = await this.daatabaseService.employee.findUnique({
            where: {
                email
            }
        })
        if (user) {
            throw new BadRequestException("User already registered");
        }

        const hashedPassword = await this.hashPassword(Dto.hashed_password);

        await this.daatabaseService.employee.create({
            data: {
                name: Dto.name,
                email: Dto.email,
                role: Dto.role,
                hashed_password: hashedPassword
            }
        })
    }

    async hashPassword(password:string){
        const saltOrRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRound);
        return hashedPassword;
    }

    async comparePassword(args : {password:string,hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }

    async signToken(args : {id:number,email:string}) {
        const payload = args;

        return this.jwtService.signAsync(payload, {secret:jwtSecret});
    }
}
