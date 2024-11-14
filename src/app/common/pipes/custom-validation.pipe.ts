import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class GraphQLValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.isValidatable(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors && errors.length > 0) {
      const translatedError = this.formatErrors(errors);
      throw new UnprocessableEntityException({
        statusCode: 422,
        message: 'Validation failed',
        errors: translatedError,
      });
    }
    return value;
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((error) => ({
      field: error.property,
      constraints: Object.values(error.constraints || {}),
    }));
  }

  private isValidatable(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];

    return (
      !types.includes(metatype) &&
      typeof metatype === 'function' &&
      Reflect.hasMetadata('design:paramtypes', metatype)
    );
  }
}
