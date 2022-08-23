import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { DataTableOptionsDto as BaseDataTableOptionsDto } from '../../dto/data-table-options.dto';

export class DataTableOptionsDto extends BaseDataTableOptionsDto {
  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  activeOnly?: boolean;

  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  allTags?: boolean;

  @Type(() => String)
  search?: string = '';

  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags?: Array<string>;

  term(): string {
    return this.search?.trim();
  }

  hasTags(): boolean {
    return !!this.tags?.length;
  }
}

export default DataTableOptionsDto;
