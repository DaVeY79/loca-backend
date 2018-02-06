import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Location } from './';

@Entity()
@Index('unique_index_user_on_phone_country_and_number', ['phoneCountryCode', 'phoneNumber'], { unique: true })
export class User extends BaseEntity {
  @PrimaryColumn({ default: () => 'gen_random_uuid()', type: 'uuid' })
  public id: string;

  @Column()
  @Index('unique_index_user_on_username', { unique: true })
  public username: string;

  @Column({ nullable: true })
  public name?: string;

  @Column({ nullable: true })
  public email?: string;

  @Column()
  public phoneCountryCode: string;

  @Column()
  public phoneNumber: string;

  @Column({ nullable: true })
  @Index('unique_index_user_on_api_token', { unique: true })
  public apiToken?: string;

  @Column({ nullable: true })
  @Index('unique_index_user_on_account_kit_id', { unique: true })
  public accountKitID?: string;

  @Column({ nullable: true })
  public accountKitAccessToken: string;

  @OneToMany(type => Location, location => location.user, { eager: true })
  public locations: Location[];
}
