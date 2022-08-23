import { Tag, TagType } from '@prisma/client';

class TagTypeDto {
  constructor(private readonly value: string, private readonly text: string) {}
}

class TagItemForSelectDto {
  constructor(
    private readonly id: string,
    private readonly label: string,
    private readonly tagType: TagTypeDto,
  ) {}
  static fromTag(
    tag: Tag & {
      tagType: TagType;
    },
  ) {
    return new TagItemForSelectDto(
      tag.id,
      tag.label,
      new TagTypeDto(tag.tagType.id, tag.tagType.label),
    );
  }
}

export default TagItemForSelectDto;
