import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import TypeTagInput from './input-tag-type.dto';

export class UpdateTagDto {
  @IsNotEmpty({ message: 'label is required' })
  label: string;

  @IsNotEmpty({ message: 'tag type is required' })
  @Type(() => TypeTagInput)
  @ValidateNested()
  tagType: TypeTagInput;
}

export default UpdateTagDto;
