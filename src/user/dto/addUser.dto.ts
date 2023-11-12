import { IsNotEmpty, IsOptional, IsArray, IsEmail} from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    role: string;

    @IsNotEmpty() 
    parent: number; // parent's id

    @IsOptional()
    @IsArray()
    children: number[]; // children's id
}