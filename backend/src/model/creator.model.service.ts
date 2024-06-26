import { Injectable } from '@nestjs/common';
import { Creator, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CreatorModelService {
  constructor(private prisma: PrismaService) {}

  async creator(
    userWhereUniqueInput: Prisma.CreatorWhereUniqueInput,
  ): Promise<Creator | null> {
    return this.prisma.creator.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async creators(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CreatorWhereUniqueInput;
    where?: Prisma.CreatorWhereInput;
    orderBy?: Prisma.CreatorOrderByWithRelationInput;
  }): Promise<Creator[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.creator.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createOrUpdateCreator(params: {
    where: Prisma.CreatorWhereUniqueInput;
    create: Prisma.CreatorCreateInput;
    update: Prisma.CreatorUpdateInput;
  }): Promise<Creator> {
    const { where, create, update } = params;

    return this.prisma.creator.upsert({
      where,
      create,
      update,
    });
  }

  async deleteCreator(where: Prisma.CreatorWhereUniqueInput): Promise<Creator> {
    return this.prisma.creator.delete({
      where,
    });
  }

  async changeBlockedState(
    userId: number,
    isBlocked: boolean,
  ): Promise<boolean> {
    const creator = await this.prisma.creator.findUnique({
      where: { id: userId },
    });

    if (creator) {
      await this.prisma.creator.update({
        where: { id: userId },
        data: { isBlocked },
      });
      return true;
    }
    return false;
  }
}
