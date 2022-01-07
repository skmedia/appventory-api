import { IsNotEmpty } from 'class-validator';

export class UpdateTagTypeDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

export default UpdateTagTypeDto;
