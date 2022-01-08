import {
  Controller,
  Get,
  HttpException,
  Headers,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CurrentAccount } from 'src/auth/auth.decorator';
import { TagGroupsService } from './tag-groups.service';

@Controller({
  path: 'tag-groups',
  version: '1',
})
export class TagGroupsController {
  constructor(private readonly tagGroupsService: TagGroupsService) {}

  @Get('/:id')
  async getTagType(@Param('id') id: string, @CurrentAccount() accountId) {
    const tagGroup = await this.tagGroupsService.findById(id);
    if (!tagGroup || tagGroup.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tag group not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return tagGroup;
  }

  @Get()
  getList(@CurrentAccount() accountId) {
    return this.tagGroupsService.getList(accountId);
  }
}
