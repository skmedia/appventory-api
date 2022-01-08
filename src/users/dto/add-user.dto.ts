import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export default AddUserDto;
