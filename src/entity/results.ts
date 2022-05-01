import {Entity,Column, PrimaryColumn} from 'typeorm';
@Entity()
export class Result{
    @PrimaryColumn()
    roll:number;
    @Column()
    institute:string;
    @Column()
    eiin:number;
    @Column()
    result:string;
    @Column()
    semester:string;
    @Column()
    district:string;
    @Column()
    regulation:number;

}