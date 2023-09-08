AppSettingsPage({
  // 测试
  build(props) {
    return Section({}, [
      View(
        {
          style: {
            marginTop: '50px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'clear data',
            // color: 'secondary',
            color: 'default',
            onClick: () => {
              props.settingsStorage.setItem('data:clear', true)
            },
          }),
        ],
      ),
      ////////////////////////////////////////////////////////////////
      View(
        {
          style: {
            marginTop: '50px',
            textAlign: 'center',
          },
        },
        [Text({}, ['network download file'])],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'start',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('downloadFile:start', true)
            },
          }),
        ],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'stop',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('downloadFile:stop', true)
            },
          }),
        ],
      ),
      ////////////////////////////////////////////////////////////////
      View(
        {
          style: {
            marginTop: '50px',
            textAlign: 'center',
          },
        },
        [Text({}, ['image convert'])],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'start',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('convertImage:start', true)
            },
          }),
        ],
      ),
      ////////////////////////////////////////////////////////////////////////
      View(
        {
          style: {
            marginTop: '50px',
            textAlign: 'center',
          },
        },
        [Text({}, ['transfer file from mobile to device'])],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'start',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('sideTransfer:start', true)
            },
          }),
        ],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'stop',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('sideTransfer:stop', true)
            },
          }),
        ],
      ),
      ////////////////////////////////////////////////////////////////////////
      View(
        {
          style: {
            marginTop: '50px',
            textAlign: 'center',
          },
        },
        [Text({}, ['transfer file from device to mobile'])],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
          },
        },
        [
          Button({
            label: 'start',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('deviceTransfer:start', true)
            },
          }),
        ],
      ),
      View(
        {
          style: {
            marginTop: '10px',
            textAlign: 'center',
            marginBottom: '50px',
          },
        },
        [
          Button({
            label: 'stop',
            color: 'primary',
            onClick: () => {
              props.settingsStorage.setItem('deviceTransfer:stop', true)
            },
          }),
        ],
      ),
    ])
  },
})
