import OlStyle from 'ol/style/Style';
import OlStyleIcon  from 'ol/style/Icon';
import OlStyleUtil from '../../src/Util/OlStyleUtil';
import { getShapeSvg, removeDuplicateShapes } from '../../src/Util/svgs';

const shape = removeDuplicateShapes('shape://times');

const svg = getShapeSvg(shape, {
  stroke: '#FF0000',
  dimensions: 12
});

const olSimpleTimes = new OlStyle({
  image: new OlStyleIcon({
    src: OlStyleUtil.getBase64EncodedSvg(svg),
    crossOrigin: 'anonymous'
  })
});

export default olSimpleTimes;
