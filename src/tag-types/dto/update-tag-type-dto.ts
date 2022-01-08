import { IsNotEmpty } from 'class-validator';

export class UpdateTagTypeDto {
  @IsNotEmpty({ message: 'label is required' })
  label: string;
}

export default UpdateTagTypeDto;
