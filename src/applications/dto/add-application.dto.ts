import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddApplicationDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'client is required' })
  client: any;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: Array<any>;

  @IsOptional()
  links: Array<any>;

  @IsOptional()
  notes: Array<any>;

  @IsOptional()
  teamMembers: Array<any>;

  @IsOptional()
  filesToAdd: Array<any>;
}

export default AddApplicationDto;
