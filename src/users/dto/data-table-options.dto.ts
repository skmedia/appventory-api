import { Type } from 'class-transformer';
import { DataTableOptionsDto as BaseDataTableOptionsDto } from '../../dto/data-table-options.dto';

export class DataTableOptionsDto extends BaseDataTableOptionsDto {
  @Type(() => String)
  search?: string = '';

  term(): string {
    return this.search?.trim();
  }
}
export default DataTableOptionsDto;