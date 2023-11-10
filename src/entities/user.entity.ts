import { Exclude } from 'class-transformer';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';

// enum UserRole {
//     CEO = 'CEO',
//     CTO = 'CTO',
//     CFO = 'CFO',
//     Dev = 'Dev',
//     Fin = 'Fin',
//   }

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column(
    // {
    //     type: 'enum',
    //     enum: UserRole
    // }
    )
    role: string;

    @Exclude()
    @ManyToOne(() => User, user => user.children, {nullable: true})
    // parent: number;
    parent: User;
    
    @OneToMany(()=>User, user => user.parent)
    // children: number[];
    children: User[];

    
}