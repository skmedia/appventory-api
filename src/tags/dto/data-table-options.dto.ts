import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DataTableOptionsDto as BaseDataTableOptionsDto } from '../../dto/data-table-options.dto';

class TagFilterDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  name: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  tagType: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  tagGroup: string;
}

export class DataTableOptionsDto extends BaseDataTableOptionsDto {
  @Type(() => String)
  search?: string = '';

  @IsOptional()
  @Type(() => TagFilterDto)
  @Transform(({ value }) => JSON.parse(value))
  filter: TagFilterDto;

  term(): string {
    return this.search?.trim();
  }
}

export default DataTableOptionsDto;
