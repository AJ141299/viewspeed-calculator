import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dpiControl = new FormControl();
  screenWidthControl = new FormControl();
  fieldOfViewControl = new FormControl();
  sensInInch: number | undefined;
  sensInCm: number | undefined;

  ngOnInit() {
    this.dpiControl.setValue(localStorage.getItem('dpi'));
    this.screenWidthControl.setValue(localStorage.getItem('screenWidth'));
    this.fieldOfViewControl.setValue(localStorage.getItem('fov'));
    const sensInInch = localStorage.getItem('sensInInch');
    const sensInCm = localStorage.getItem('sensInCm');
    this.sensInInch = sensInInch ? Number(sensInInch) : undefined;
    this.sensInCm = sensInCm ? Number(sensInCm) : undefined;
  }

  calculate() {
    if (
      !this.dpiControl.value ||
      !this.screenWidthControl.value ||
      !this.fieldOfViewControl.value
    ) {
      this.sensInInch = undefined;
      this.sensInCm = undefined;
      return;
    }

    const dpi = this.dpiControl.value;
    const screenWidth = this.screenWidthControl.value;
    const fov = this.fieldOfViewControl.value;

    const d = screenWidth / dpi;

    const firstHalf = d * Math.PI;
    const secondHalf =
      Math.cos((Math.PI * this.degToRadians(fov)) / this.degToRadians(720)) *
      (1 -
        Math.cos((Math.PI * this.degToRadians(fov)) / this.degToRadians(360)) +
        Math.sin((Math.PI * this.degToRadians(fov)) / this.degToRadians(360)));

    const sensInInches = firstHalf / secondHalf;
    this.sensInInch = this.roundNum(sensInInches);
    this.sensInCm = this.roundNum(sensInInches * 2.54);

    localStorage.setItem('sensInInch', this.sensInInch?.toString());
    localStorage.setItem('sensInCm', this.sensInCm?.toString());
    localStorage.setItem('dpi', dpi);
    localStorage.setItem('fov', fov);
    localStorage.setItem('screenWidth', screenWidth);
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
