import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { AccountsService } from './accounts.service';
import { AddAccountDto } from './dto/index.dto';

@Controller({
  path: 'accounts',
  version: '1',
})
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Post()
  @Public()
  async addAccount(@Body() data: AddAccountDto): Promise<any> {
    return await this.accountsService.create(data);
  }
}
