import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';

@Injectable()
export class VehiculesService {
    constructor( private Prisma: PrismaService){}


    async createVehicule(createVehiculeDto: CreateVehiculeDto, userId?: number) {
        const { seller_id, images, ...rest } = createVehiculeDto;
        
        // Log de contrôle
        console.log(`[vehicules] images reçues: ${Array.isArray(images) ? images.length : 'undefined'}`, images);
        
        // Convertir les types pour Prisma
        const vehiculeData = {
            ...rest,
            price: typeof (rest as any).price === 'string' ? parseFloat((rest as any).price.replace(/[.,]/g, '')) : (rest as any).price,
            year: typeof (rest as any).year === 'string' ? parseInt((rest as any).year) : (rest as any).year,
        };
        
        // Vérifier si le vendeur existe 
        if (userId) {
            const seller = await this.Prisma.sellers.findUnique({
                where: { userId: userId },
            });
            if (!seller) {
                throw new ForbiddenException('Vous devez être un vendeur pour créer un véhicule');
            }
            // Bloquer si le vendeur n'est pas approuvé
            if (!(seller as any).is_approved) {
                throw new ForbiddenException('Votre compte vendeur n\'est pas approuvé.');
            }
            // Utiliser l'ID du vendeur trouvé au lieu de seller_id du DTO
            const vehicule = await this.Prisma.vehicules.create({
                data: {
                    ...vehiculeData,
                    seller_id: seller.id,
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

            // Créer les images si elles existent
            if (Array.isArray(images) && images.length > 0) {
                await this.Prisma.vehiculeImage.createMany({
                    data: images.map((url) => ({
                        url,
                        vehiculeId: vehicule.id,
                    })),
                });
                
                // Récupérer le véhicule avec les images
                return this.Prisma.vehicules.findUnique({
                    where: { id: vehicule.id },
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

            return vehicule;
        }
        
        // Si pas d'userId, utiliser seller_id du DTO
        if (!seller_id) {
            throw new ForbiddenException('Un vendeur valide est requis pour créer un véhicule');
        }
        // Vérifier l'approbation du vendeur référencé par seller_id
        const sellerById = await this.Prisma.sellers.findUnique({ where: { id: seller_id } });
        if (!sellerById) {
            throw new ForbiddenException('Vendeur introuvable');
        }
        if (!(sellerById as any).is_approved) {
            throw new ForbiddenException('Votre compte vendeur n\'est pas approuvé.');
        }
        const vehicule = await this.Prisma.vehicules.create({
            data: {
                ...vehiculeData,
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

        // Créer les images si elles existent
        if (Array.isArray(images) && images.length > 0) {
            await this.Prisma.vehiculeImage.createMany({
                data: images.map((url) => ({
                    url,
                    vehiculeId: vehicule.id,
                })),
            });
            
            // Récupérer le véhicule avec les images
            return this.Prisma.vehicules.findUnique({
                where: { id: vehicule.id },
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

        return vehicule;
    }
} 

