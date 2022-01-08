import { IsNotEmpty, IsOptional } from 'class-validator';

interface TagInput {
  id: string;
  label: string;
}

export class UpdateApplicationDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'client is required' })
  client: any;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: Array<TagInput>;

  @IsOptional()
  links: Array<any>;

  @IsOptional()
  teamMembers: Array<any>;

  @IsOptional()
  fileDescriptions: Array<string>;

  @IsOptional()
  assets: Array<any>;

  @IsOptional()
  filesToAdd: Array<any>;
}

export default UpdateApplicationDto;
