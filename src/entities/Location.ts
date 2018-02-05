import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './';

import { PointTransformer } from './transformers';

export enum LocationAccess {
  PRIVATE = 'PRIVATE',
  PUBLIC  = 'PUBLIC',
}

@Entity()
@Index('unique_index_location_on_user_id_and_code', ['user', 'code'], { unique: true })
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(type => User, user => user.locations, { nullable: false })
  public user: User;

  @Column({ default: LocationAccess.PRIVATE })
  public access: LocationAccess;

  @Column('point', { transformer: new PointTransformer() })
  public point: [number, number];

  @Column()
  public code: string;

  @Column()
  public description: string;
}
