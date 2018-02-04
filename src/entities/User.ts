import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IAccountKitAccessToken, IAccountKitAccount } from '../connectors/AccountKit';
import accountKit from '../router/accountKit';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public email: string;

  @Column()
  public phoneCountryCode: string;

  @Column()
  public phoneNumber: string;

  @Column({ nullable: true })
  public apiToken: string;

  @Column({ nullable: true })
  public accountKitID: string;

  @Column({ nullable: true })
  public accountKitAccessToken: string;
}
