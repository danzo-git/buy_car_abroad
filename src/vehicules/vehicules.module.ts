import { Module } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { VehiculesController } from './vehicules.controller';

@Module({
  providers: [VehiculesService],
  controllers: [VehiculesController]
})
export class VehiculesModule {}
