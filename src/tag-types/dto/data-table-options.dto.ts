import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

class TagFilterDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  label: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  tagGroup: string;
}

export class DataTableOptionsDto {
  @Type(() => Number)
  page?: number = 1;

  @Type(() => Number)
  itemsPerPage?: number = 10;

  @Type(() => String)
  search?: string = '';

  sortBy?: Array<string>;
  sortDesc?: Array<string>;

  @IsOptional()
  @Type(() => TagFilterDto)
  filter: TagFilterDto;

  skip(): number {
    return (this.page - 1) * this.itemsPerPage;
  }

  take(): number {
    return this.itemsPerPage;
  }

  term(): string {
    return this.search?.trim();
  }
}
export default DataTableOptionsDto;
