import { NgModule, ModuleWithProviders } from '@angular/core';

import { Option } from './option';

@NgModule({
  declarations: [
    Option
  ],
  exports: [
    Option
  ]
})
export class OptionModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: OptionModule, providers: []
    };
  }
}
