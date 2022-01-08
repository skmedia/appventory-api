import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;

  @IsNotEmpty({ message: 'firstname is required' })
  firstName: string;

  @IsNotEmpty({ message: 'role is required' })
  @IsIn(['user', 'admin'], { message: 'role is required' })
  role: string;

  @IsEmail()
  email: string;
}

export default UpdateUserDto;
