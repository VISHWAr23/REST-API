import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users = [{ id: 1, name: "Alice Johnson", gmail: "alice.johnson@gmail.com", role: "Employee" },
        { id: 2, name: "Bob Smith", gmail: "bob.smith@gmail.com", role: "Owner" },
        { id: 3, name: "Charlie Brown", gmail: "charlie.brown@gmail.com", role: "Employee" },
        { id: 4, name: "Diana Prince", gmail: "diana.prince@gmail.com", role: "Employee" },
        { id: 5, name: "Ethan Hunt", gmail: "ethan.hunt@gmail.com", role: "Owner" },
        { id: 6, name: "Fiona Gallagher", gmail: "fiona.gallagher@gmail.com", role: "Employee" },
        { id: 7, name: "George Clooney", gmail: "george.clooney@gmail.com", role: "Employee" },
        { id: 8, name: "Hannah Montana", gmail: "hannah.montana@gmail.com", role: "Owner" },
        { id: 9, name: "Ian Somerhalder", gmail: "ian.somerhalder@gmail.com", role: "Employee" },
        { id: 10, name: "Jessica Alba", gmail: "jessica.alba@gmail.com", role: "Employee" }
    ];

    findAll(role?: 'Employee' | 'Owner') {
        if (role) {
            const roleArray = this.users.filter(user => user.role === role);
            if (roleArray.length === 0) {
                throw new NotFoundException(`No user found with role ${role}`);
            }
            return roleArray;
        }
        return this.users;
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    create(user : CreateUserDto) {
        let userByHighestId = this.users.length;
        const newUser = {
            id : userByHighestId+1,
            ...user
        }
        this.users.push(newUser);
        return newUser;
    }

    update(id: number, updatedUser : UpdateUserDto) {
        this.users = this.users.map(user => {
            if(user.id === id){
                return {
                    ...user,
                    ...updatedUser
                }
            }
            return user;
        });
        return this.findOne(id);
    }

    delete(id: number) {
        const deletedUser = this.findOne(id);
        this.users = this.users.filter(user => user.id !== id);
        return deletedUser;
    }
}
