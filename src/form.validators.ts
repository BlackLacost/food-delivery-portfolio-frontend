import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator'
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
