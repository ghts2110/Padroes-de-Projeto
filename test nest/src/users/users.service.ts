import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: CreateUserDto[] = [];

  create(userDto: CreateUserDto) {
    const newUser = { id: Date.now(), ...userDto };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }
}
