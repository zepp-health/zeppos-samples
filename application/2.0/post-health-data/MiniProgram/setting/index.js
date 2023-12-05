import { gettext } from "i18n";

AppSettingsPage({
  state: {
    sleepData: {},
    dataReady: false,
  },
  build(props) {
    console.log(gettext("example"));
    console.log(this.state.sleepData);

    this.getStorage(props);

    const ButtonList = [];

    ButtonList.push(
      Button({
        style: {
          display: "block",
          margin: "1em 1em 0 1em",
          width: "auto",
          fontSize: "1.5rem",
        },
        label: "Request Sleep Data From Device App",
        color: "primary",
        onClick: () => {
          this.requestData(props);
        },
      })
    );

    if (this.state.sleepData.utc) {
      ButtonList.push(
        Button({
          style: {
            display: "block",
            margin: "1em 1em 0 1em",
            width: "auto",
            fontSize: "1.5rem",
          },
          color: "secondary",
          label: "Post Data To Web Service",
          onClick: () => {
            this.postData(props);
          },
        })
      );
    }

    const DataList = Object.entries(this.state.sleepData).map(([key, val]) => {
      return View(
        {
          style: {
            margin: "1em 1em 0 1em",
            fontSize: "1.5rem",
            lineHeight: "1.5rem",
          },
        },
        [`${key}: ${val}`]
      );
    });

    return View({}, [
      ButtonList,
      DataList,
    ]);
  },
  getStorage(props) {
    try {
      const sleepData = JSON.parse(props.settingsStorage.getItem("sleepData"));

      if (sleepData === null) {
        throw new Error("no data");
      }

      this.state.sleepData = sleepData;
      this.state.dataReady = true;
    } catch (error) {
      console.log(error);
      this.state.sleepData = {};
      this.state.dataReady = false;
    }
  },
  requestData(props) {
    const current = props.settingsStorage.getItem("REQUEST_ACTION");

    props.settingsStorage.setItem("REQUEST_ACTION", !current);
  },
  postData(props) {
    const current = props.settingsStorage.getItem("POST_ACTION");

    props.settingsStorage.setItem("POST_ACTION", !current);
  },
});
