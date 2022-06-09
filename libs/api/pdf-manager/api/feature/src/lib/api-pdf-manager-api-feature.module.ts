import { Module } from '@nestjs/common';
import { ApiPdfManagerApiFeatureResolver } from './api-pdf-manager-api-feature.resolver';
import { ApiPdfManagerServiceFeatureService, ApiPdfManagerServiceFeatureModule } from '@conversation-catcher/api/pdf-manager/service/feature';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';

/*@Module({
  imports: [ApiPdfManagerApiFeatureResolver],
  controllers: [],
  providers: [ApiPdfManagerServiceFeatureService],
  exports: [ApiPdfManagerApiFeatureResolver],
})
export class ApiPdfManagerApiFeatureModule {}*/

@Module({
  imports: [ApiPdfManagerServiceFeatureModule, CqrsModule, ApiPdfManagerServiceFeatureService],
  controllers: [],
  providers: [
    CommandBus,
    QueryBus,
    //PrismaService,
    ApiPdfManagerApiFeatureResolver,
    ApiPdfManagerServiceFeatureService,
    
  ]
  
})
export class ApiStudentExploreApiFeatureModule {}