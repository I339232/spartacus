import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import {
  LibraryOptions as SpartacusSmartEditOptions,
  SpartacusOptions,
} from '@spartacus/schematics';
import * as path from 'path';
import { CLI_SMARTEDIT_FEATURE } from '../constants';

const collectionPath = path.join(__dirname, '../collection.json');
const smarteditModulePath =
  'src/app/spartacus/features/smart-edit-feature.module.ts';

describe('Spartacus SmartEdit schematics: ng-add', () => {
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  const workspaceOptions: any = {
    name: 'workspace',
    version: '0.5.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'schematics-test',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    projectRoot: '',
  };

  const defaultOptions: SpartacusSmartEditOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [CLI_SMARTEDIT_FEATURE],
  };

  const spartacusDefaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    configuration: 'b2c',
  };

  beforeEach(async () => {
    schematicRunner.registerCollection(
      '@spartacus/schematics',
      '../../projects/schematics/src/collection.json'
    );
    schematicRunner.registerCollection(
      '@spartacus/organization',
      '../../feature-libs/organization/schematics/collection.json'
    );

    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@spartacus/schematics',
        'ng-add',
        { ...spartacusDefaultOptions, name: 'schematics-test' },
        appTree
      )
      .toPromise();
  });

  describe('SmartEdit feature', () => {
    describe('assets', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultOptions, appTree)
          .toPromise();
      });

      it('should add update angular.json with smartedit/assets', async () => {
        const content = appTree.readContent('/angular.json');
        const angularJson = JSON.parse(content);
        const buildAssets: any[] =
          angularJson.projects['schematics-test'].architect.build.options
            .assets;
        expect(buildAssets).toEqual([
          'src/favicon.ico',
          'src/assets',
          {
            glob: '**/*',
            input: './node_modules/@spartacus/smartedit/assets',
            output: 'assets/',
          },
        ]);

        const testAssets: any[] =
          angularJson.projects['schematics-test'].architect.test.options.assets;
        expect(testAssets).toEqual([
          'src/favicon.ico',
          'src/assets',
          {
            glob: '**/*',
            input: './node_modules/@spartacus/smartedit/assets',
            output: 'assets/',
          },
        ]);
      });
    });

    describe('eager loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync(
            'ng-add',
            { ...defaultOptions, lazy: false },
            appTree
          )
          .toPromise();
      });

      it('should import appropriate modules', async () => {
        const smarteditModule = appTree.readContent(smarteditModulePath);
        expect(smarteditModule).toContain(
          `import { SmartEditRootModule } from "@spartacus/smartedit/root";`
        );
        expect(smarteditModule).toContain(
          `import { SmartEditModule } from "@spartacus/smartedit";`
        );
      });

      it('should not contain lazy loading syntax', async () => {
        const smarteditModule = appTree.readContent(smarteditModulePath);
        expect(smarteditModule).not.toContain(
          `import('@spartacus/smartedit').then(`
        );
      });
    });

    describe('lazy loading', () => {
      beforeEach(async () => {
        appTree = await schematicRunner
          .runSchematicAsync('ng-add', defaultOptions, appTree)
          .toPromise();
      });

      it('should import SmartEditRootModule and contain the lazy loading syntax', async () => {
        const smarteditModule = appTree.readContent(smarteditModulePath);
        expect(smarteditModule).toContain(
          `import { SmartEditRootModule } from "@spartacus/smartedit/root";`
        );
        expect(smarteditModule).toContain(
          `import('@spartacus/smartedit').then(`
        );
      });

      it('should not contain the SmartEditModule import', () => {
        const smarteditModule = appTree.readContent(smarteditModulePath);
        expect(smarteditModule).not.toContain(
          `import { SmartEditModule } from "@spartacus/smartedit";`
        );
      });
    });
  });
});
