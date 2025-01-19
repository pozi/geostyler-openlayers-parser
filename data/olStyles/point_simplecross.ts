import OlStyle from 'ol/style/Style';
import OlStyleIcon  from 'ol/style/Icon';
import OlStyleUtil from '../../src/Util/OlStyleUtil';
import { getShapeSvg } from '../../src/Util/svgs';

let svg = getShapeSvg('cross', {
  stroke: '#FF0000',
  dimensions: 12
});

const olSimpleCross = new OlStyle({
  image: new OlStyleIcon({
    src: OlStyleUtil.getBase64EncodedSvg(svg),
    crossOrigin: 'anonymous'
  })
});

export default olSimpleCross;
