import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn, QueryFailedError } from 'typeorm';
import { Location, LocationAuthorization } from './';

import { IsEmail, validate } from 'class-validator';

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
  @IsEmail()
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

  @OneToMany(type => Location, location => location.user)
  public locations: Location[];

  @OneToMany(type => LocationAuthorization, authorizations => authorizations.owner)
  public locationRequests: LocationAuthorization[];

  @OneToMany(type => LocationAuthorization, authorizations => authorizations.viewer)
  public locationGrants: LocationAuthorization[];

  public async validateAndSave(): Promise<User> {
    try {
      const errors = await validate(this);
      if (errors.length > 0) {
        throw new Error('Validation failed');
      }
      await this.save();
      return this;
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).constraint === 'unique_index_user_on_username') {
        throw new Error('Sorry, that username is taken');
      }
      throw error;
    }
  }
}
