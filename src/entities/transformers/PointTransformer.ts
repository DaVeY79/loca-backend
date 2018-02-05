import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class PointTransformer implements ValueTransformer {

  public to(value: [number, number]): string {
    return `${value[0]},${value[1]}`;
  }

  public from (value: { x: number, y: number }): [number, number] {
    return [value.x, value.y];
  }

}
