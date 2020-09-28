import { Injectable } from '@angular/core';
import { Converter, Occ } from '@spartacus/core';
import { B2BUnitNode } from '@spartacus/my-account/organization/core';

@Injectable()
export class OccOrgUnitNodeListNormalizer
  implements Converter<Occ.B2BUnitNodeList, B2BUnitNode[]> {
  convert(source: Occ.B2BUnitNodeList, target?: B2BUnitNode[]): B2BUnitNode[] {
    if (target === undefined) {
      target = [...(source.unitNodes as any)];
    }
    return target;
  }
}
