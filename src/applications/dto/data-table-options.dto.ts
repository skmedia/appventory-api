import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { DataTableOptionsDto as BaseDataTableOptionsDto } from '../../dto/data-table-options.dto';

export class DataTableOptionsDto extends BaseDataTableOptionsDto {
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
