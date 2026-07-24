import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';
import { Roles } from '../../common/auth/roles.decorator';

@Controller('admin/configuracion')
@Roles('ROLE_ADMINISTRADOR')
export class ConfiguracionAdminController {
  constructor(private readonly service: ConfiguracionService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  update(@Body() dto: UpdateConfiguracionDto) {
    return this.service.update(dto);
  }
}

// Read-only, used by the public home/footer.
@Controller('public/configuracion')
export class ConfiguracionPublicController {
  constructor(private readonly service: ConfiguracionService) {}

  @Get()
  get() {
    return this.service.get();
  }
}
