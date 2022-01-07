import { IsNotEmpty } from 'class-validator';

export class AddTagTypeDto {
  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'tag group is required' })
  tagGroupId: string;
}

export default AddTagTypeDto;
