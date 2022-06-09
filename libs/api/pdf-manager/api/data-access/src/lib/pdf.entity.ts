import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PdfEntity {
  /*
  id
	name
	pdf
	creationDate
	dowloaded
  */
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  pdf: File;

  @Field()
  creationDate: Date;
  
  @Field()
  downloaded: boolean;
}
