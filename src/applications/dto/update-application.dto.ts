import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import NoteDto from './note.dto';

class TagInput {
  @IsNotEmpty({ message: 'tagId is required' })
  id: string;

  @IsNotEmpty({ message: 'tagLabel is required' })
  label: string;
}

export class UpdateApplicationDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'client is required' })
  client: any;

  @IsOptional()
  @MaxLength(500, {
    message: 'Description must be max $constraint1 characters long',
  })
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TagInput)
  tags: TagInput[];

  @IsOptional()
  links: Array<any>;

  @IsOptional()
  teamMembers: Array<any>;

  @IsOptional()
  @ValidateNested()
  @Type(() => NoteDto)
  notes: NoteDto[];

  @IsOptional()
  fileDescriptions: Array<string>;

  @IsOptional()
  assets: Array<any>;

  @IsOptional()
  filesToAdd: Array<any>;
}

export default UpdateApplicationDto;
