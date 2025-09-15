import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';

@Injectable()
export class VehiculesService {
    constructor( private Prisma: PrismaService){}


    async createVehicule(createVehiculeDto: CreateVehiculeDto, userId?: number) {
        const { seller_id, images, ...rest } = createVehiculeDto;
        
        // Vérifier si le vendeur existe 
        if (userId) {
            const seller = await this.Prisma.sellers.findUnique({
                where: { userId: userId },
            });
            if (!seller) {
                throw new ForbiddenException('Vous devez être un vendeur pour créer un véhicule');
            }
            // Utiliser l'ID du vendeur trouvé au lieu de seller_id du DTO
            return this.Prisma.vehicules.create({
                data: {
                    ...rest,
                    seller_id: seller.id,
                    // Gérer les images correctement pour Prisma
                    images: images ? { 
                        create: images.map((url) => ({ url })) 
                    } : undefined,
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
        
        // Si pas d'userId, utiliser seller_id du DTO
        return this.Prisma.vehicules.create({
            data: {
                ...rest,
                seller_id,
                // Gérer les images correctement pour Prisma
                images: images ? { 
                    create: images.map((url) => ({ url })) 
                } : undefined,
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

