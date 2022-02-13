import { Controller } from '@nestjs/common';
import { UserAccountsService } from './user-accounts.service';

@Controller({
  path: 'user-accounts',
  version: '1',
})
export class UserAccountsController {
  constructor(private readonly userAccountssService: UserAccountsService) {}
}
