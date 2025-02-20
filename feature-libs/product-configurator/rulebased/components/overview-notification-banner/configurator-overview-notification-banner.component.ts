import { Component } from '@angular/core';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
  ConfiguratorRouter,
  ConfiguratorRouterExtractorService,
} from '@spartacus/product-configurator/common';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { Configurator } from '../../core/model/configurator.model';

@Component({
  selector: 'cx-configurator-overview-notification-banner',
  templateUrl: './configurator-overview-notification-banner.component.html',
})
export class ConfiguratorOverviewNotificationBannerComponent {
  routerData$: Observable<ConfiguratorRouter.Data> = this.configRouterExtractorService.extractRouterData();

  numberOfIssues$: Observable<number> = this.routerData$.pipe(
    filter(
      (routerData) =>
        routerData.owner.type === CommonConfigurator.OwnerType.PRODUCT ||
        routerData.owner.type === CommonConfigurator.OwnerType.CART_ENTRY
    ),
    switchMap((routerData) =>
      this.configuratorCommonsService.getConfiguration(routerData.owner)
    ),
    distinctUntilKeyChanged('configId'),
    map((configuration) => configuration.totalNumberOfIssues)
  );

  iconTypes = ICON_TYPE;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected commonConfigUtilsService: CommonConfiguratorUtilsService
  ) {}

  protected countIssuesInGroup(group: Configurator.Group): number {
    let numberOfIssues = 0;
    group.attributes.forEach((attribute) => {
      numberOfIssues =
        numberOfIssues + (attribute.incomplete && attribute.required ? 1 : 0);
    });
    return numberOfIssues;
  }
}
