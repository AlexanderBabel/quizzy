import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = (isPublic?: boolean) =>
  SetMetadata(IS_PUBLIC_KEY, isPublic ?? true);
