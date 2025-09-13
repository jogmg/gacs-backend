import { Controller, Get, Param } from '@nestjs/common';
import { InstitutionService } from './institution.service';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get('dashboard/:id')
  getDashboard(@Param('id') institutionId: string) {
    return this.institutionService.getDashboard(institutionId);
  }
}
