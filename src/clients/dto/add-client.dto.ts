import { IsNotEmpty } from 'class-validator';

export class AddClientDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

export default AddClientDto;
