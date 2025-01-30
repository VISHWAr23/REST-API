import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './utils/constants'

@Injectable()
export class AuthService {

    constructor(private daatabaseService : DatabaseService, private jwtService : JwtService) {}

    async login(dto: AuthDto, req : Request, res : Response) {
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
