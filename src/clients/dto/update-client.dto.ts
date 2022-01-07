import { IsNotEmpty } from 'class-validator';

export class UpdateClientDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

export default UpdateClientDto;
