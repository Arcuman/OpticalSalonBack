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
  Req,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import {
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../roles/decorators/roles.decorator';
import { Role } from '../../roles/enums/role.enum';
import { RolesGuard } from '../../roles/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Consultation } from './consultation.model';
import { Request } from 'express';

@ApiTags('Консультации')
@ApiSecurity('bearer')
@Controller('consultations')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Roles(Role.USER)
  @ApiBody({
    description: 'Add new consultation',
    type: CreateConsultationDto,
  })
  @ApiResponse({ status: 200, type: Consultation })
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createConsultationDto: CreateConsultationDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.consultationService.create(createConsultationDto, user.userId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: [Consultation] })
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  @Get()
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.consultationService.findAll(offset, limit);
  }

  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: Consultation })
  @Get(':id')
  findOne(@Param() id: number) {
    return this.consultationService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.consultationService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(+id);
  }*/
}
