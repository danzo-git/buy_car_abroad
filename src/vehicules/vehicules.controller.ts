import { Controller, Post,  UploadedFiles,
    UseInterceptors,
    UseGuards,Req
   } from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

import { extname } from "path";

// Interface pour étendre Request avec la propriété user
interface RequestWithUser extends Request {
    user: {
        id: number;
        [key: string]: any;
    };
}

@ApiTags('vehicules')
@ApiBearerAuth()
@Controller('vehicules')
export class VehiculesController {

    constructor(private readonly vehiculesService: VehiculesService) {}

@Post('create')
@UseGuards(AuthGuard('Jwt'))
@UseInterceptors(
    FilesInterceptor('images',5,{
        storage:diskStorage({
            destination:'./uploads/vehicules',
            filename:(req,file,callback)=>{
                const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9);
                const ext=extname(file.originalname);
                callback(null,uniqueSuffix+ext);
            }
        })
    })
)
    async createVehicule(@Body() createVehiculeDto: CreateVehiculeDto,
@UploadedFiles() files : Express.Multer.File[],
@Req() req: RequestWithUser) {
        // Extraire les URLs des fichiers uploadés
        const imageUrls = files ? files.map(file => `/uploads/vehicules/${file.filename}`) : [];
        
        // Ajouter les URLs d'images au DTO
        const dtoWithImages = {
            ...createVehiculeDto,
            images: imageUrls
        };
        
        // Appeler le service avec l'ID de l'utilisateur connecté
        return this.vehiculesService.createVehicule(dtoWithImages, req.user.id);
    }
}
