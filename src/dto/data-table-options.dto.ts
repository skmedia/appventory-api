import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional } from 'class-validator';

interface Foo {
  [key: number]: boolean;
}

export class DataTableOptionsDto {
  @Type(() => Number)
  page?: number = 1;

  @Type(() => Number)
  itemsPerPage?: number = 10;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  sortBy?: Array<string>;

  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  mustSort?: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => {
    return value.map(
      (v: string): Prisma.SortOrder =>
        [true, 'enabled', 'true'].indexOf(v) > -1 ? 'desc' : 'asc',
    );
  })
  sortDesc?: Array<Prisma.SortOrder>;

  needsPaging(): boolean {
    return this.itemsPerPage > 0;
  }

  skip(): number {
    if (this.itemsPerPage < 0) {
      return 0;
    }
    return (this.page - 1) * this.itemsPerPage;
  }

  take(): number {
    if (this.itemsPerPage < 0) {
      return 1000;
    }
    return this.itemsPerPage;
  }
}

export default DataTableOptionsDto;
