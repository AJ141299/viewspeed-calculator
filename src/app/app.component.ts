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
  sens: number | undefined;

  ngOnInit() {
    this.dpiControl.setValue(localStorage.getItem("dpi"))
    this.screenWidthControl.setValue(localStorage.getItem("screenWidth"))
    this.fieldOfViewControl.setValue(localStorage.getItem("fov"))
    const sens = localStorage.getItem("sens")
    this.sens = sens ? Number(sens) : undefined
  }

  calculate() {
    if (
      !this.dpiControl.value ||
      !this.screenWidthControl.value ||
      !this.fieldOfViewControl.value
    ) {
      console.log('Please enter values');
      return;
    }

    const dpi = this.dpiControl.value;
    const screenWidth = this.screenWidthControl.value;
    const fov = this.fieldOfViewControl.value;

    const d = screenWidth / dpi;

    const firstHalf = (d * Math.PI)
    const secondHalf = (Math.cos(Math.PI * this.degToRadians(fov) / this.degToRadians(720))) * (1 - (Math.cos(Math.PI * this.degToRadians(fov) / this.degToRadians(360))) + (Math.sin((Math.PI * this.degToRadians(fov))  / this.degToRadians(360))))

    const sensInInches = firstHalf / secondHalf
    this.sens = parseFloat((sensInInches).toFixed(4));

    localStorage.setItem("sens", this.sens?.toString())
    localStorage.setItem("dpi", dpi)
    localStorage.setItem("fov", fov)
    localStorage.setItem("screenWidth", screenWidth)
  }

  copy() {
    if (this.sens) {
      navigator.clipboard.writeText(`${this.sens}`);
    }
  }

  degToRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  roundNum(num: Number) {
    return parseFloat((num).toFixed(4))
  }
}
