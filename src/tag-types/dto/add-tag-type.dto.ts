import { IsNotEmpty } from 'class-validator';

export class AddTagTypeDto {
  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsNotEmpty({ message: 'name is required' })
  label: string;

  @IsNotEmpty({ message: 'tag group is required' })
  tagGroupId: string;
}

export default AddTagTypeDto;
