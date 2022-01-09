import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export class DataTableOptionsDto {
  @Type(() => Number)
  page?: number = 1;

  @Type(() => Number)
  itemsPerPage?: number = 10;

  @Type(() => String)
  search?: string = '';

  @IsOptional()
  @IsArray()
  @Type(() => String)
  //@IsIn(['name', 'client.name'], { message: 'invalid sort field' })
  sortBy?: Array<string>;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  sortDesc?: Array<string>;

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
