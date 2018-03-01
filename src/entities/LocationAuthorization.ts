import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, QueryFailedError } from 'typeorm';
import { Location, User } from './';

export enum LocationAuthorizationStatus {
  REQUESTED = 'REQUESTED',
  APPROVED  = 'APPROVED',
}

@Entity()
@Index('unique_index_location_authorizations_on_location_and_viewer', ['location', 'viewer'], { unique: true })
export class LocationAuthorization extends BaseEntity {
  @PrimaryColumn({ default: () => 'gen_random_uuid()', type: 'uuid' })
  public id: string;

  @ManyToOne(type => User, user => user.locationRequests, { nullable: false, eager: true })
  public owner: User;

  @ManyToOne(type => User, user => user.locationGrants, { nullable: false, eager: true })
  public viewer: User;

  @ManyToOne(type => Location, location => location.authorizations, { nullable: false, eager: true })
  public location: Location;

  @Column({ default: LocationAuthorizationStatus.REQUESTED })
  public status: LocationAuthorizationStatus;

}
