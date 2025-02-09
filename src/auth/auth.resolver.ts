import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Employee } from '../database/schemas/employee.schema';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => Employee)
  async getEmployee(@Args('id') id: string) {
    return this.authService.getEmployee(id);
  }

  @Query(() => [Employee])
  async getAllEmployees() {
    return this.authService.getAllEmployees();
  }
}
