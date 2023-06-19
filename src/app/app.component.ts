import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  baseSensControl = new FormControl();
  baseFovControl = new FormControl();
  newFovControl = new FormControl();
  newSens: number | undefined;

  ngOnInit() {
    this.baseSensControl.setValue(localStorage.getItem('baseSens'));
    this.baseFovControl.setValue(localStorage.getItem('baseFov'));
    this.newFovControl.setValue(localStorage.getItem('newFov'));
    const newSens = localStorage.getItem('newSens');
    this.newSens = newSens ? Number(newSens) : undefined;
  }

  calculate() {
    if (
      !this.baseSensControl.value ||
      !this.baseFovControl.value ||
      !this.newFovControl.value
    ) {
      this.newSens = undefined;
      return;
    }

    const baseSens = this.baseSensControl.value;
    const baseFov = this.baseFovControl.value;
    const newFov = this.newFovControl.value;

    const ratio = Math.sin(this.degToRadians(baseFov * Math.PI/360)) / Math.sin(this.degToRadians(newFov * Math.PI/360))
    this.newSens = this.roundNum(ratio * baseSens);

    localStorage.setItem('newSens', this.newSens?.toString());
    localStorage.setItem('baseSens', baseSens);
    localStorage.setItem('newFov', newFov);
    localStorage.setItem('baseFov', baseFov);
  }

  copy(sens: number | undefined) {
    if (sens) {
      navigator.clipboard.writeText(sens.toString());
    }
  }

  degToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  roundNum(num: Number) {
    return parseFloat(num.toFixed(4));
  }
}
