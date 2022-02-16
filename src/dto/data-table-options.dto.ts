import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export class DataTableOptionsDto {
  @Type(() => Number)
  page?: number = 1;

  @Type(() => Number)
  itemsPerPage?: number = 10;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  sortBy?: Array<string>;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  sortDesc?: Array<string>;

  needsPaging(): boolean {
    return this.itemsPerPage > 0
  }

  skip(): number {
    return (this.page - 1) * this.itemsPerPage;
  }

  take(): number {
    return this.itemsPerPage;
  }
}

export default DataTableOptionsDto;
