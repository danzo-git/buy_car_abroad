import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { SellersModule } from './sellers/sellers.module';
import { VehiculesModule } from './vehicules/vehicules.module';

@Module({
  imports: [AuthModule,PrismaModule, SellersModule, VehiculesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
