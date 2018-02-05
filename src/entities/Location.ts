import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,  } from 'typeorm';
import { User } from './';

import { PointTransformer } from './transformers';

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(type => User, user => user.locations, { nullable: false })
  public user: User;

  @Column('point', { transformer: new PointTransformer() })
  public point: [number, number];
}
