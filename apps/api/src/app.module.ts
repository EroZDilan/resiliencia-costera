import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoopAuthGuard } from './common/auth/noop-auth.guard';
import { AdjuntoModule } from './modules/adjunto/adjunto.module';
import { OrganizacionModule } from './modules/organizacion/organizacion.module';
import { ProyectoModule } from './modules/proyecto/proyecto.module';
import { ProvinciaModule } from './modules/provincia/provincia.module';
import { MunicipioModule } from './modules/municipio/municipio.module';
import { GlosarioModule } from './modules/glosario/glosario.module';
import { MarcoLegalModule } from './modules/marco-legal/marco-legal.module';
import { BibliografiaModule } from './modules/bibliografia/bibliografia.module';
import { EditorialModule } from './modules/editorial/editorial.module';
import { ColaboracionModule } from './modules/colaboracion/colaboracion.module';
import { EventoModule } from './modules/evento/evento.module';
import { NoticiaModule } from './modules/noticia/noticia.module';
import { IniciativaModule } from './modules/iniciativa/iniciativa.module';
import { IncidenciaModule } from './modules/incidencia/incidencia.module';
import { ConfiguracionModule } from './modules/configuracion/configuracion.module';
import { FaqModule } from './modules/faq/faq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        // TiDB Serverless (and most managed MySQL) require TLS on their public endpoint.
        ssl: config.get('DB_SSL') === 'true' ? { minVersion: 'TLSv1.2' } : undefined,
        autoLoadEntities: true,
        // Never true: this schema is shared with the live PHP app and with
        // the resiliencia-mysql container used by both stacks in parallel.
        synchronize: false,
      }),
    }),
    AdjuntoModule,
    OrganizacionModule,
    ProyectoModule,
    ProvinciaModule,
    MunicipioModule,
    GlosarioModule,
    MarcoLegalModule,
    BibliografiaModule,
    EditorialModule,
    ColaboracionModule,
    EventoModule,
    NoticiaModule,
    IniciativaModule,
    IncidenciaModule,
    ConfiguracionModule,
    FaqModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: NoopAuthGuard }],
})
export class AppModule {}
