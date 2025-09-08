import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nom complet',
    example: 'Thomas Dupont',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Email',
    example: 'thomas.dupont@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '+33 6 12 34 56 78',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone_number: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Indique si l’utilisateur s’inscrit en tant que vendeur',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_seller?: boolean;

  @ApiProperty({
    description: 'Nom de l’entreprise (si vendeur)',
    example: 'Renault',
    required: false,
  })
  @IsString()
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    description: 'Pays de l’entreprise (si vendeur)',
    example: 'France',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Indique si l’utilisateur s’inscrit en tant que vendeur',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_approved: boolean;
}
