import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import TypeTagInput from './input-tag-type.dto';

export class UpdateTagDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'tag type is required' })
  @Type(() => TypeTagInput)
  @ValidateNested()
  TagType: TypeTagInput;
}

export default UpdateTagDto;
