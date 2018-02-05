import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from './';

@Entity()
@Index('unique_index_user_on_phone_country_and_number', ['phoneCountryCode', 'phoneNumber'], { unique: true })
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
  @Index('unique_index_user_on_api_token', { unique: true })
  public apiToken: string;

  @Column({ nullable: true })
  @Index('unique_index_user_on_account_kit_id', { unique: true })
  public accountKitID: string;

  @Column({ nullable: true })
  public accountKitAccessToken: string;

  @OneToMany(type => Location, location => location.user)
  public locations: Location[];
}
