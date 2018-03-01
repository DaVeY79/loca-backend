import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Location } from './';

@Entity()
export class EphemeralToken extends BaseEntity {
  @PrimaryColumn({ default: () => 'gen_random_uuid()', type: 'uuid' })
  public id: string;

  @ManyToOne(type => Location, location => location.tokens, { nullable: false, eager: true })
  public location: Location;

  @Index('unique_ephemeral_token_on_key', { unique: true })
  @Column({ nullable: false })
  public key: string;

  @Column('timestamp', { nullable: false, precision: 3 })
  public expiry: Date;
}
