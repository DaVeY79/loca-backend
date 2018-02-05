import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class PointTransformer implements ValueTransformer {

  public to(value: [number, number]): string {
    if (value[0] && value[1]) {
      return value.join(',');
    }
    return null;
  }

  public from (value: { x: number, y: number }): [number, number] {
    return [value.x, value.y];
  }

}
