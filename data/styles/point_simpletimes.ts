import { Style } from 'geostyler-style';

const pointSimpleTimes: Style = {
  name: 'OL Style',
  rules: [
    {
      name: 'OL Style Rule 0',
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'shape://times',
        strokeColor: '#FF0000',
        radius: 6
      }]
    }
  ]
};

export default pointSimpleTimes;
