import PageAdvanced from "../../utils/template/PageAdvanced";
import { Geolocation } from "@zos/sensor";

PageAdvanced({
  state: {
    pageName: "Geolocation",
    instance: null
  },
  build() {
    const geolocation = new Geolocation();
    this.state.instance = geolocation

    const callback = () => {
      console.log(geolocation.getStatus())
      if (geolocation.getStatus() === "A") {
        console.log('latitude', geolocation.getLatitude());
        console.log('longitude', geolocation.getLongitude());
      }
    };

    geolocation.start();
    geolocation.onChange(callback);
  },
  onDestroy() {
    this.state.instance && this.state.instance.stop()
  }
});
