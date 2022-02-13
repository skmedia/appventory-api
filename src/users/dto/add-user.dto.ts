import { IsEmail, IsIn, IsNotEmpty, Validate } from 'class-validator';
import { UserIsUnique } from '../unique-user.validator';

export class AddUserDto {
  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;

  @IsNotEmpty({ message: 'firstname is required' })
  firstName: string;

  @IsNotEmpty({ message: 'role is required' })
  @IsIn(['user', 'admin'], { message: 'role is required' })
  role: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  //@Validate(UserIsUnique)
  email: string;
}

export default AddUserDto;
