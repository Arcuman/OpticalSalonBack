import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { RolesGuard } from '../roles/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Salon } from './salon.model';
import { ConsultationService } from './consultation/consultation.service';

@ApiTags('Салоны')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('salons')
export class SalonController {
  constructor(
    private readonly salonService: SalonService,
    private readonly consultationService: ConsultationService,
  ) {}

  @Roles(Role.ADMIN)
  @ApiBody({
    description: 'Add new salon',
    type: CreateSalonDto,
  })
  @ApiResponse({ status: 200, type: Salon })
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createSalonDto: CreateSalonDto) {
    return this.salonService.create(createSalonDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Salon] })
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.salonService.findAll(offset, limit);
  }

  @Get('/:salonId/consultations')
  @ApiResponse({ status: 200, type: [Salon] })
  @ApiParam({ name: 'salonId', type: 'Number', required: true })
  findAllConsultations(@Param('salonId') salonId: string) {
    return this.consultationService.findAllBySalonId(+salonId);
  }

  @ApiResponse({ status: 200, type: Salon })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.salonService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salonService.remove(+id);
  }*/
}
