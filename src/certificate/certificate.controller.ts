import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  async create(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificateService.create(createCertificateDto);
  }

  @Get()
  async findAll() {
    return await this.certificateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.certificateService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    return await this.certificateService.update(id, updateCertificateDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return await this.certificateService.delete(id);
  // }
}
