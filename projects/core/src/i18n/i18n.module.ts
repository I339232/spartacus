import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  ConfigInitializer,
  CONFIG_INITIALIZER,
} from '../config/config-initializer/config-initializer';
import { provideDefaultConfig } from '../config/config-providers';
import { FeatureConfigService } from '../features-config/services/feature-config.service';
import { defaultI18nConfig } from './config/default-i18n-config';
import { I18nConfig } from './config/i18n-config';
import { I18nConfigInitializer } from './config/i18n-config-initializer';
import { CxDatePipe } from './date.pipe';
import { i18nextProviders } from './i18next/i18next-providers';
import { I18nextTranslationService } from './i18next/i18next-translation.service';
import { TranslatePipe } from './translate.pipe';
import { TranslationService } from './translation.service';

export function initI18nConfig(
  configInitializer: I18nConfigInitializer,
  config: I18nConfig,
  featureConfigService: FeatureConfigService
): ConfigInitializer | null {
  // TODO(#11515): remove it in 4.0
  if (!featureConfigService.isLevel('3.2')) {
    return null;
  }
  /**
   * If `fallbackLang` was already configured statically
   */
  if (config?.i18n?.fallbackLang !== undefined) {
    return null;
  }
  return configInitializer;
}

@NgModule({
  declarations: [TranslatePipe, CxDatePipe],
  exports: [TranslatePipe, CxDatePipe],
})
export class I18nModule {
  static forRoot(): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [
        provideDefaultConfig(defaultI18nConfig),
        { provide: TranslationService, useExisting: I18nextTranslationService },
        ...i18nextProviders,
        {
          provide: CONFIG_INITIALIZER,
          useFactory: initI18nConfig,
          deps: [I18nConfigInitializer, I18nConfig, FeatureConfigService],
          multi: true,
        },
      ],
    };
  }
}
