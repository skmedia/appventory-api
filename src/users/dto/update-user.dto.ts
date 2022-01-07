import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;

  @IsNotEmpty({ message: 'firstname is required' })
  firstName: string;

  @IsEmail()
  email: string;
}

export default UpdateUserDto;
