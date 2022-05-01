import {Entity,PrimaryColumn,Column} from 'typeorm';

@Entity()
export class currentResult{
    @PrimaryColumn()
    eiin:number;
    @Column()
    institute:string;
    @Column()
    semester:string;
    @Column()
    pass:number;
    @Column()
    fail:number;
    @Column()
    district:string;
    @Column()
    regulation:number;
    @Column()
    passingRate:string;
}