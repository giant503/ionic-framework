import { Component } from '@angular/core';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
})
export class InputsComponent {

  datetime: string;
  input: string;
  checkbox = false;
  toggle = false;
  select: string;
  range: number;

  setValues() {
    console.log('set values');
    this.datetime = '1994-03-15';
    this.input = 'some text';
    this.checkbox = true;
    this.toggle = true;
    this.select = 'nes';
    this.range = 10;
  }

  resetValues() {
    console.log('reset values');
    this.datetime = undefined;
    this.input = undefined;
    this.checkbox = false;
    this.toggle = false;
    this.select = undefined;
    this.range = undefined;
  }
}
