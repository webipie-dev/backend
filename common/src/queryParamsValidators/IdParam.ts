import { IsMongoId, ValidationArguments } from 'class-validator';
import { isNotMongoId } from '../class-validator-message/error-message';

export class IdParam {
    @IsMongoId({
        message: (validationData: ValidationArguments) =>
            isNotMongoId(validationData.property),
    })
    id: string | undefined;
}
