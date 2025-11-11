/** 
 * @contribution The loading indicator (spinner.png) is provided by Creatype
 *               https://www.flaticon.com/free-icons/loading  
 */

import { createWidget, widget, prop, deleteWidget } from '@zos/ui';
import { DeviceInfo } from '../../helpers/required';

export class Preloader {
  constructor() {
    this.device_info = DeviceInfo; // DeviceInfo = getDeviceInfo();
    this.preloader_widget = null;
    this.spinner_widget = null;
    this.spinner_timer = null;
    this.is_active = false;
  }

  show() {
    if (this.is_active) return;
    this.is_active = true;

    const { width, height } = this.device_info;
    const spinner_size = 64;
    const cx = (width - spinner_size) / 2;
    const cy = (height - spinner_size) / 2;

    this.preloader_widget = createWidget(widget.IMG, {
      x: 0,
      y: 0,
      src: 'preloader.png',
    });

    this.spinner_widget = createWidget(widget.IMG, {
      x: cx,
      y: cy,
      src: 'spinner.png',
      angle: 0,
      center_x: spinner_size / 2,
      center_y: spinner_size / 2,
    });

    let angle = 0;
    this.spinner_timer = setInterval(() => {
      angle = (angle + 5) % 360;
      if (this.spinner_widget) {
        this.spinner_widget.setProperty(prop.ANGLE, angle);
      }
    }, 1);
  }

  hide() {
    if (!this.is_active) return;
    this.is_active = false;

    if (this.spinner_timer) {
      clearInterval(this.spinner_timer);
      this.spinner_timer = null;
    }

    if (this.spinner_widget) {
      deleteWidget(this.spinner_widget);
      this.spinner_widget = null;
    }

    if (this.preloader_widget) {
      deleteWidget(this.preloader_widget);
      this.preloader_widget = null;
    }
  }

  destroy() {
    this.hide();
  }
}