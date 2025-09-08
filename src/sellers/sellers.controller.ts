import { Controller, UseGuards, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SellersService } from './sellers.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ApproveSellerDto } from './dto/approve-seller.dto';

@Controller('sellers')
export class SellersController {
constructor(private sellersService: SellersService) {}
   
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('pending/all')
  findPendingSellers() {
    return this.sellersService.findPendingSellers();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('pending/approve/:id')
  approveSeller(
    @Param('id', ParseIntPipe) id: number, 
    @Body() approveSellerDto: ApproveSellerDto
  ) {
    return this.sellersService.approveSeller(id, approveSellerDto);
  }
}
