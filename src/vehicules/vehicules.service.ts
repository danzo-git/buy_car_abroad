import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
//import {se}from
@Injectable()
export class VehiculesService {
    constructor( private Prisma: PrismaService){}


    async createVehicule(createVehiculeDto: CreateVehiculeDto,userId?: number){ {

        const {  seller_id,...data} = createVehiculeDto;
        // verifier si le vendeur existe 
        if(userId){
            const seller = await this.Prisma.sellers.findUnique({
                where: { userId: userId},
               
            });
            if (!seller) {
                throw new ForbiddenException('Vous devez être un vendeur pour créer un véhicule');
              }
        }
       
       
        return this.Prisma.vehicules.create({
            data: {
              ...data,
              seller_id,
            },
            include: {
              images: true,
              seller: {
                include: {
                  user: {
                    select: {
                      id: true,
                      full_name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          });
        }

}
}

