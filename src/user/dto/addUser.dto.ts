import { IsNotEmpty, IsOptional, IsArray, IsEmail} from "class-validator";

enum UserRole {
    CEO = 'CEO',
    CTO = 'CTO',
    CFO = 'CFO',
    Dev = 'Dev',
    Fin = 'Fin',
  }

export class AddUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    role: UserRole;

    @IsNotEmpty() // I can't make this optional
    parent: number; // parent's id

    @IsOptional()
    @IsArray()
    children: number[]; // children's id
}