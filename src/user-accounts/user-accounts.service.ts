import { Injectable } from '@nestjs/common';
import { UserAccount } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserAccountsService {
  constructor(private prisma: PrismaService) {}

  async findByUserIdAndAccountId(
    userId: string,
    accountId: string,
  ): Promise<any> {
    return this.prisma.userAccount.findUnique({
      where: {
        userId_accountId: {
          userId: userId,
          accountId: accountId,
        },
      },
      include: {
        account: true,
        user: {
          include: {
            userAccounts: {
              include: {
                account: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<UserAccount[]> {
    return this.prisma.userAccount.findMany({
      where: {
        userId: userId,
      },
      include: {
        account: true,
      },
    });
  }

  async findOtherUserAccounts(
    userId: string,
    excludeAccountId: string,
  ): Promise<UserAccount[]> {
    return this.prisma.userAccount.findMany({
      where: {
        userId: userId,
        account: {
          isNot: {
            id: excludeAccountId,
          },
        },
      },
    });
  }
}
