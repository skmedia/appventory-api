import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { TagGroupsService } from './tag-groups.service';

@Controller({
  path: 'tag-groups',
  version: '1',
})
export class TagGroupsController {
  constructor(private readonly tagGroupsService: TagGroupsService) {}

  @Get('/:id')
  async getTagType(@Param('id') id: string) {
    const tagGroup = await this.tagGroupsService.findById(id);
    if (!tagGroup) {
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
  getList() {
    return this.tagGroupsService.getList();
  }
}
