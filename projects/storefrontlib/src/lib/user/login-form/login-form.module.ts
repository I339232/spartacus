import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form.component';
import { UserModule, UrlTranslationModule } from '@spartacus/core';
import { CmsModule } from '../../cms/cms.module';
import { BootstrapModule } from '../../bootstrap.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CmsModule,
    BootstrapModule,
    UserModule,
    UrlTranslationModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
  entryComponents: [LoginFormComponent]
})
export class LoginFormModule {}
