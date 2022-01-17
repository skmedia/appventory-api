import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { UserIsUnique } from 'src/users/unique-user.validator';

export class AddAccountDto {
  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsNotEmpty({ message: 'account name is required' })
  name: string;

  @IsNotEmpty({ message: 'lastname is required' })
  lastName: string;

  @IsNotEmpty({ message: 'firstname is required' })
  firstName: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  @Validate(UserIsUnique)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty({ message: 'Password confirm is required' })
  @IsString()
  passwordConfirm: string;
}

export default AddAccountDto;
