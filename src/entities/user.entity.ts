import { Exclude } from 'class-transformer';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    role: string;

    @Exclude()
    @ManyToOne(() => User, user => user.children, {nullable: true})
    // parent: number;
    parent: User;
    
    @OneToMany(()=>User, user => user.parent)
    // children: number[];
    children: User[];

    constructor(email: string,  full_name: string,  role: string,  parent: User){
        this.email = email
        this.full_name = full_name
        this.role = role
        this.parent = parent
    }
    
}