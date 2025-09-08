import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { UserRole } from '@prisma/client';

// import { UserRole } from './dto/role-enum';

@Injectable()
export class SellersService {

    constructor(private prisma: PrismaService) {}

    async findPendingSellers(){
        return this.prisma.sellers.findMany({
            where:{
                is_approved: false,
            },
            include:{
                user:{
                    select:{
                        id: true,
                        full_name: true,
                    }
                }
            }
        })
    }

    async approveSeller(id:number, approveSellerDto: ApproveSellerDto){
    
        //verifier si le vendeur existe
        const seller = await this.prisma.sellers.findUnique({
            where: { id },
            include: {
              user: true,
            },
          });
      
          if (!seller) {
            throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
          }
      
          // Mettre à jour le statut d'approbation du vendeur
          await this.prisma.sellers.update({
            where: { id },
            data: { 
              is_approved: approveSellerDto.is_approved
            },
          });
      
          // Mettre à jour le rôle de l'utilisateur
          await this.prisma.users.update({
            where: { id: seller.userId },
            data: { 
              role: approveSellerDto.is_approved ? UserRole.seller : UserRole.client
            },
          });
          return {
            id: seller.id,
            user_id: seller.user.id,
            company_name: seller.company_name,
            country: seller.country,
            is_approved: approveSellerDto.is_approved,
            user: {
              id: seller.user.id,
              full_name: seller.user.full_name,
              email: seller.user.email,
              role: approveSellerDto.is_approved ? UserRole.seller : UserRole.client,
            },
      
    }
    }
}