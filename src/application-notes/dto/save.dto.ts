import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import NoteDto from './note.dto';

export class SaveDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => NoteDto)
  notes: NoteDto[];
}

export default SaveDto;
