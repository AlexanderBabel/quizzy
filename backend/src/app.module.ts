import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, AdminModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
