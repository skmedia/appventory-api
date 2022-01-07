import { Type } from 'class-transformer';

export class DataTableOptionsDto {
  @Type(() => Number)
  page?: number = 1;

  @Type(() => Number)
  itemsPerPage?: number = 10;

  @Type(() => String)
  search?: string = '';

  sortBy?: Array<string>;
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
