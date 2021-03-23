import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CmsPageHeaderComponent,
  PageMeta,
  PageMetaService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';

@Component({
  selector: 'cx-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent implements OnInit {
  title$: Observable<string>;

  constructor(
    public component: CmsComponentData<CmsPageHeaderComponent>,
    protected pageMetaService: PageMetaService
  ) {}

  ngOnInit(): void {
    this.setTitle();
  }

  private setTitle(): void {
    this.title$ = this.pageMetaService.getMeta().pipe(
      filter(Boolean),
      map((meta: PageMeta) => meta.heading || meta.title)
    );
  }
}
