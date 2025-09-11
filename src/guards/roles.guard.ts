import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Vérifier si l'utilisateur a l'un des rôles requis
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRequiredRole) {
      return false;
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est approuvé
    if (user.role === 'seller') {
      const seller = await this.prisma.sellers.findFirst({
        where: { 
          userId: user.id,
          is_approved: true 
        },
      });

      if (!seller) {
        throw new ForbiddenException('Votre compte vendeur est en attente d\'approbation par un administrateur');
      }
    }

    return true;
  }
}