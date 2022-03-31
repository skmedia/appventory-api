import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

class NoteDto {
  @IsOptional()
  id: string;

  @IsNotEmpty({ message: 'Note text is required' })
  @MaxLength(500, {
    message: 'Note text must be max $constraint1 characters long',
  })
  text: string;

  @IsNotEmpty({ message: 'tag is required' })
  tag: any;

  @IsOptional()
  isNew: boolean;
}

export default NoteDto;
