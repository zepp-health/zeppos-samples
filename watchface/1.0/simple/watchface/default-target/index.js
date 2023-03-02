// This code defines a watch face using the DeviceRuntimeCore.WatchFace object.
(() => {
    // These variables store references to the digital time widget and the time sensor.
    let digitalTime = "";
    let heartRate = "";
    let stepCount = "";
    let timeSensor = "";
    let heartSensor = "";
    let stepSensor = "";
    __$$module$$__.module = DeviceRuntimeCore.WatchFace({
        init_view() {
            // Create a background rectangle widget for the watch face.
            hmUI.createWidget(hmUI.widget.FILL_RECT, {
                x: 0,
                y: 0,
                w: 480,
                h: 480,
                color: "0xFF343934",
                radius: 240,
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
            // Create a digital time widget for the watch face.
            digitalTime = hmUI.createWidget(hmUI.widget.TEXT, {
                x: 141,
                y: 190,
                w: 200,
                h: 100,
                text: "[HOUR_24_Z]:[MIN_Z]",
                color: "0xFF497d80",
                text_size: 60,
                text_style: hmUI.text_style.NONE,
                align_h: hmUI.align.CENTER_H,
                align_v: hmUI.align.CENTER_V,
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
            // Create a heart rate widget for the watch face.
            heartRate = hmUI.createWidget(hmUI.widget.TEXT, {
                x: 346,
                y: 215,
                w: 100,
                h: 40,
                text: "HR:[HR]",
                color: "0xFFf30000",
                text_size: 17,
                text_style: hmUI.text_style.NONE,
                align_h: hmUI.align.LEFT,
                align_v: hmUI.align.TOP,
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
            // Create a step count widget for the watch face.
            stepCount = hmUI.createWidget(hmUI.widget.TEXT, {
                x: 190,
                y: 302,
                w: 100,
                h: 40,
                text: "SC:[SC]",
                color: "0xFF76dd81",
                text_size: 17,
                text_style: hmUI.text_style.NONE,
                align_h: hmUI.align.LEFT,
                align_v: hmUI.align.TOP,
                show_level: hmUI.show_level.ONLY_NORMAL,
            });
            // Create the time sensor if it doesn't exist yet.
            if (!timeSensor) {
                timeSensor = hmSensor.createSensor(hmSensor.id.TIME);
            }
            // Create the heart sensor if it doesn't exist yet.
            if (!heartSensor) {
                heartSensor = hmSensor.createSensor(hmSensor.id.HEART);
            }
            // Create the step sensor if it doesn't exist yet.
            if (!stepSensor) {
                stepSensor = hmSensor.createSensor(hmSensor.id.STEP);
            }
            // When the minute changes, update the digital time widget.
            timeSensor.addEventListener(timeSensor.event.MINUTEEND, function () {
                digitalTime.setProperty(hmUI.prop.MORE, {
                    text: `${String(timeSensor.hour).padStart(2, "0")}:${String(
                        timeSensor.minute
                    ).padStart(2, "0")}`,
                });
            });
            // When the heart value changes, update the heart rate widget.
            heartSensor.addEventListener(heartSensor.event.LAST, function () {
                heartRate.setProperty(hmUI.prop.MORE, {
                    text: `HR:${heartSensor.last}`,
                });
            });
            // When the step value changes, update the step count widget.
            stepSensor.addEventListener(hmSensor.event.CHANGE, function () {
                stepCount.setProperty(hmUI.prop.MORE, {
                    text: `SC:${stepSensor.current}`,
                });
            });

            digitalTime.setProperty(hmUI.prop.MORE, {
                text: `${String(timeSensor.hour).padStart(2, "0")}:${String(
                    timeSensor.minute
                ).padStart(2, "0")}`,
            });
            timer.createTimer(
                0,
                1000,
                function (timeSensor2) {
                    digitalTime.setProperty(hmUI.prop.MORE, {
                        text: `${String(timeSensor2.hour).padStart(2, "0")}:${String(
                            timeSensor2.minute
                        ).padStart(2, "0")}`,
                    });
                },
                timeSensor
            );
            hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
                resume_call: function () {
                    digitalTime.setProperty(hmUI.prop.MORE, {
                        text: `${String(timeSensor.hour).padStart(2, "0")}:${String(
                            timeSensor.minute
                        ).padStart(2, "0")}`,
                    });
                    heartRate.setProperty(hmUI.prop.MORE, {
                        text: `HR:${heartSensor.last}`,
                    });
                    stepCount.setProperty(hmUI.prop.MORE, {
                        text: `SC:${stepSensor.current}`,
                    });
                },
            });
        },
        build() {
            this.init_view();
        },
    });
})();
