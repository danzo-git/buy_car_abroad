import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from 'src/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}


    async register ( registerDto: RegisterDto ) {
        const {full_name,email, password, phone_number, company_name, country, is_seller } = registerDto;
        // Vérifier si l'utilisateur existe déjà
    const userExists = await this.prisma.users.findUnique({
        where: { email },
      });
  
      if (userExists) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
  
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);

      // Déterminer le rôle initial
    const role = is_seller ? 'seller' : 'client';

    //creer utilisateur
    const user = await this.prisma.users.create(
        {
            data:{
                full_name,
                email,
                phone_number,
                password: password_hash,
                role,
            }
        }
    )

    //si c'est un vendeur, créer un vendeur
    if(is_seller){
        await this.prisma.sellers.create({
            data:{
                company_name,
                
                country,
                userId: user.id,
            },
        })
      
        };
        const token = this.generateToken(user);
        return {
            user,
            token,
        }
    }
       



    //login
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.users.findUnique({
            where: { email },
            include: {
                seller: true,
            },
        });
        if(!user){
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.generateToken(user);
        return {
            user:{
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                phone_number: user.phone_number,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                seller: user.seller ? {
                    id: user.seller.id,
                    company_name: user.seller.company_name,
                    country: user.seller.country,
                } : null,
                company_name: user.seller?.company_name,
                country: user.seller?.country,
            },
            token,
        }
    }
    private generateToken(user: any) {
        const payload = {
          email: user.email,
          sub: user.id,
          role: user.role,
        };
        return this.jwtService.sign(payload);
      }
    }

