import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from './users.service';

@ValidatorConstraint({ name: 'UserIsUnique', async: true })
@Injectable()
export class UserIsUnique implements ValidatorConstraintInterface {
  constructor(private userService: UsersService) {}

  async validate(value: string) {
    const user = await this.userService.findByEmail(value);
    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `A user with that email address already exists`;
  }
}
