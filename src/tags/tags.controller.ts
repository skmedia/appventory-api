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
  async forSelect(@Param('tagGroupId') tagGroupId: string) {
    const items = await this.tagsService.forSelect(tagGroupId);
    return {
      items: items,
    };
  }
  @Get()
  async getList(@Query() dataTableOptions: DataTableOptionsDto) {
    const count = await this.tagsService.count(dataTableOptions);
    const items = await this.tagsService.getList(dataTableOptions);
    return {
      items: items.map((i) => ({
        ...i,
        hasLinkedItems: !!(
          i.ApplicationLink.length ||
          i.ApplicationTeamMember.length ||
          i.ApplicationTag.length
        ),
      })),
      meta: {
        count: count,
      },
    };
  }
  @Post()
  async addTag(@Body() addTagDto: AddTagDto) {
    return await this.tagsService.createTag(addTagDto);
  }
  @Put(':id')
  async updateTag(@Body() updateTagDto: UpdateTagDto, @Param('id') id: string) {
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
    return await this.tagsService.updateTag(id, updateTagDto);
  }
  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
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
    return this.tagsService.removeTag(tag.id);
  }
}
