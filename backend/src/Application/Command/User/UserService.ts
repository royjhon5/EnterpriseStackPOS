// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../Domain/Entities/User/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(userName: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userName } });
  }

  async checkPassword(user: User, password: string): Promise<boolean> {
    const hash = user.passwordHash;
    if (typeof hash !== 'string' || hash.length === 0) {
      return false;
    }
    return bcrypt.compare(password, hash);
  }

  async getRoles(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user?.userRoles?.length) return [];

    // we'll fix mapping in step 2
    return user.userRoles.map((ur) => String(ur.roleId));
  }
}
