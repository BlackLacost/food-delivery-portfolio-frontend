import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import {
  CreateAccountInput,
  EditProfileInput,
  LoginInput,
  UserRole,
} from './gql/graphql'

export class EditProfileForm implements EditProfileInput {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @Length(3)
  password?: string
}

export class LoginForm implements LoginInput {
  @IsEmail()
  email: string

  @IsString()
  @Length(3)
  password: string
}

export class CreateAccountForm implements CreateAccountInput {
  @IsEmail()
  email: string

  @IsString()
  @Length(3)
  password: string

  @IsEnum(UserRole)
  role: UserRole
}

export class SearchTermForm {
  @IsString()
  @Length(3)
  searchTerm: string
}

export class CreateRestaurantForm {
  @IsString()
  @Length(3)
  name: string

  @IsString()
  @Length(3)
  address: string

  @IsString()
  @Length(3)
  categoryName: string

  @IsFile({ mime: ['image/jpeg', 'image/jpg', 'image/png'] })
  files: File[]
}
interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[]
}

export function IsFile(
  options: IsFileOptions,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            value?.mimetype &&
            (options?.mime ?? []).includes(value?.mimetype)
          ) {
            return true
          }
          return false
        },
      },
    })
  }
}
