import { Controller, Post } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('vehicules')
@ApiBearerAuth()
@Controller('vehicules')
export class VehiculesController {

    constructor(private readonly vehiculesService: VehiculesService) {}

@Post('create')
    async createVehicule(@Body() createVehiculeDto: CreateVehiculeDto) {
        return this.vehiculesService.createVehicule(createVehiculeDto);
      }
}
