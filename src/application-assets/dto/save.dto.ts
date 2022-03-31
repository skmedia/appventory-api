import { IsOptional } from 'class-validator';

export class SaveDto {
  @IsOptional()
  fileDescriptions: Array<string>;

  @IsOptional()
  assets: Array<any>;

  @IsOptional()
  filesToAdd: Array<any>;
}

export default SaveDto;
