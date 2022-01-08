import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import TypeTagInput from './input-tag-type.dto';

export class AddTagDto {
  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsNotEmpty({ message: 'name is required' })
  label: string;

  @IsNotEmpty({ message: 'tag type is required' })
  @Type(() => TypeTagInput)
  @ValidateNested()
  tagType: TypeTagInput;
}

export default AddTagDto;
