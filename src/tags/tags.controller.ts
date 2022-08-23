import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentAccount } from 'src/auth/auth.decorator';
import AddTagDto from './dto/add-tag.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagDto from './dto/update-tag-dto';
import { TagsService } from './tags.service';

@Controller({
  path: 'tags',
  version: '1',
})
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get(':id')
  async getTag(@Param('id') id: string) {
    const tag = await this.tagsService.findById(id);
    if (!tag) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tag not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return tag;
  }
  @Get('for-select/:tagGroupId')
  async forSelect(
    @CurrentAccount() accountId: string,
    @Param('tagGroupId') tagGroupCode?: string,
  ) {
    return { items: await this.tagsService.forSelect(accountId, tagGroupCode) };
  }
  @Get()
  async getList(
    @Query() dataTableOptions: DataTableOptionsDto,
    @CurrentAccount() accountId: string,
  ) {
    const count = await this.tagsService.count(dataTableOptions, accountId);
    const items = await this.tagsService.getList(dataTableOptions, accountId);
    return {
      items: items.map((i) => ({
        ...i,
        hasLinkedItems: !!(
          i.applicationLinks.length ||
          i.applicationTeamMembers.length ||
          i.applicationTags.length
        ),
      })),
      meta: {
        count: count,
      },
    };
  }
  @Post()
  async addTag(@Body() addTagDto: AddTagDto, @CurrentAccount() accountId) {
    return await this.tagsService.createTag(addTagDto, accountId);
  }
  @Put(':id')
  async updateTag(
    @Body() updateTagDto: UpdateTagDto,
    @Param('id') id: string,
    @CurrentAccount() accountId,
  ) {
    const tag = await this.tagsService.findById(id);
    if (!tag || tag.tagType.tagGroup.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tag not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.tagsService.updateTag(id, updateTagDto);
  }
  @Delete(':id')
  async deleteTag(@Param('id') id: string, @CurrentAccount() accountId) {
    const tag = await this.tagsService.findById(id);
    if (!tag || tag.tagType.tagGroup.accountId !== accountId) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tag not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.tagsService.removeTag(tag.id);
  }
}
