import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn, QueryFailedError } from 'typeorm';
import { User } from './';

import { IsAlphanumeric, validate } from 'class-validator';

import { PointTransformer } from './transformers';

export enum LocationAccess {
  PRIVATE = 'PRIVATE',
  PUBLIC  = 'PUBLIC',
}

@Entity()
@Index('unique_index_location_on_user_id_and_code', ['user', 'code'], { unique: true })
export class Location extends BaseEntity {
  @PrimaryColumn({ default: () => 'gen_random_uuid()', type: 'uuid' })
  public id: string;

  @ManyToOne(type => User, user => user.locations, { nullable: false })
  public user: User;

  @Column({ default: LocationAccess.PRIVATE })
  public access: LocationAccess;

  @Column('point', { transformer: new PointTransformer() })
  public point: [number, number];

  @Column()
  @IsAlphanumeric()
  public code: string;

  @Column()
  public description: string;

  public async validateAndSave(): Promise<Location> {
    try {
      const errors = await validate(this);
      if (errors.length > 0) {
        throw new Error('Validation failed');
      }
      await this.save();
      return this;
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).constraint === 'unique_index_location_on_user_id_and_code') {
        throw new Error('You have already used that code');
      }
      throw error;
    }
  }
}
