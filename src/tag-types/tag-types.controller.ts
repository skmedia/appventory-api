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
import AddTagTypeDto from './dto/add-tag-type.dto';
import DataTableOptionsDto from './dto/data-table-options.dto';
import UpdateTagTypeDto from './dto/update-tag-type-dto';
import { TagTypesService } from './tag-types.service';

@Controller({
  path: 'tag-types',
  version: '1',
})
export class TagTypesController {
  constructor(private readonly tagTypesService: TagTypesService) {}

  @Get('/:id')
  async getTagType(@Param('id') id: string) {
    const tagType = await this.tagTypesService.findById(id);
    if (!tagType) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tag type not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return tagType;
  }

  @Get('for-select/:tagGroupId')
  async forSelect(@Param('tagGroupId') tagGroupId: string) {
    const items = await this.tagTypesService.forSelect(tagGroupId);
    return {
      items: items,
    };
  }
  @Get('')
  async getList(@Query() dataTableOptions: DataTableOptionsDto) {
    const count = await this.tagTypesService.count(dataTableOptions);
    const items = await this.tagTypesService.getList(dataTableOptions);
    return {
      items: items,
      meta: {
        count: count,
      },
    };
  }
  @Post('')
  async addTagType(@Body() addTagTypeDto: AddTagTypeDto) {
    return await this.tagTypesService.createTagType(addTagTypeDto);
  }
  @Put(':id')
  async updateTagType(
    @Body() updateTagTypeDto: UpdateTagTypeDto,
    @Param('id') id: string,
  ) {
    const tagType = await this.tagTypesService.findById(id);
    if (!tagType) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tagtype not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.tagTypesService.updateTagType(
      tagType.id,
      updateTagTypeDto,
    );
  }

  @Delete(':id')
  async deleteTagType(@Param('id') id: string) {
    const tagType = await this.tagTypesService.findById(id);
    if (!tagType) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'tagtype not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.tagTypesService.removeTagType(tagType.id);
  }
}
