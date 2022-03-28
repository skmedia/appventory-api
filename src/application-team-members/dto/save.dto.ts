import { IsArray, IsOptional } from 'class-validator';

export class SaveDto {
  @IsOptional()
  @IsArray()
  teamMembers: Array<any>;
}

export default SaveDto;
