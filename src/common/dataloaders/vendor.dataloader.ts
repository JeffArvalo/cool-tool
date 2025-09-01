import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { VendorService } from 'src/vendor/vendor.service';
import { Vendor } from 'src/vendor/vendor.model';

@Injectable({ scope: Scope.REQUEST })
export class VendorDataLoader {
  constructor(private vendorService: VendorService) {}

  createLoader() {
    return new DataLoader<string, Vendor | null>(
      async (vendorIds: readonly string[]) => {
        const vendors = await this.vendorService.findManyByIds(
          vendorIds as string[],
        );
        const vendorMap = new Map(vendors.map((v) => [v.id, v]));
        return vendorIds.map((id) => vendorMap.get(id) || null);
      },
    );
  }
}
