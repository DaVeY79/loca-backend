import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class PointTransformer implements ValueTransformer {

  public to(value: [number, number]): string {
    return value.join(',');
  }

  public from (value: { x: number, y: number }): [number, number] {
    return [value.x, value.y];
  }

}
