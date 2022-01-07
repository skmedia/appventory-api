import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { PrismaService } from '../prisma.service';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [TagsService, PrismaService],
    }).compile();

    service = moduleRef.get<TagsService>(TagsService);
    controller = moduleRef.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('addTag should be defined', () => {
    expect(controller.addTag).toBeDefined();
  });
});
