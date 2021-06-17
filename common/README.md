<h1 align="center">Welcome to Webipie Microservices Common 👋</h1>

## Install

```sh
npm install @webipie/common
```

## How It Works

```ts
/**
    main.ts 
**/
import AllExceptionFilter from '@webipie/common';


app.useGlobalFilters(new AllExceptionFilter());

/**
    Dto's
**/
import { isRequired, isNotMongoId } from '@webipie/common';
export class CreateStoreDto {
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly name: string;
  // ... 
}

/**
    cats.controller.ts
**/
import { IdParam } from '@webipie/common';

@Get('/:id')
  async getOneCat(@Param() param: IdParam): Promise<Store> {
    return await this.catService.getOneCat(param.id);
  }



```

## Author

👤 **Webipie**

* Github: [@webipie](https://github.com/webipie-dev)

_This README was generated with by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
