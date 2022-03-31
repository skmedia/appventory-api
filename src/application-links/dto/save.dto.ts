import { IsArray, IsOptional } from 'class-validator';

export class SaveDto {
  @IsOptional()
  @IsArray()
  links: Array<any>;
}

export default SaveDto;
