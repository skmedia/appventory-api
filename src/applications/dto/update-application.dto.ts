import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

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
}

export default UpdateApplicationDto;
