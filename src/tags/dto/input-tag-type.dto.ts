import { IsNotEmpty } from 'class-validator';

class TypeTagInput {
  @IsNotEmpty({ message: 'text is required' })
  text: string;

  @IsNotEmpty({ message: 'value is required' })
  value: string;
}

export default TypeTagInput;
