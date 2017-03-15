import { NgModule, ModuleWithProviders } from '@angular/core';

import { Img } from './img';

@NgModule({
  declarations: [
    Img
  ],
  exports: [
    Img
  ]
})
export class ImgModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImgModule, providers: []
    };
  }
}
