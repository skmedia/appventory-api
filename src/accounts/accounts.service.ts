import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddAccountDto } from './dto/index.dto';
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/users/role.enum';
import { hash } from 'bcrypt';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}
  async create(data: AddAccountDto) {
    const password = await hash(data.email, 10);

    return this.prisma.account.create({
      data: {
        id: data.id,
        name: data.name,
        userAccounts: {
          create: {
            id: uuidv4(),
            user: {
              create: {
                id: uuidv4(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: password,
                role: Role.User,
              },
            },
          },
        },
      },
    });
  }
}
