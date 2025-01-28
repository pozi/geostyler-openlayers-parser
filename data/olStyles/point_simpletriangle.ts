import OlStyle from 'ol/style/Style';
import OlStyleIcon  from 'ol/style/Icon';
import OlStyleUtil from '../../src/Util/OlStyleUtil';
import { getShapeSvg, removeDuplicateShapes } from '../../src/Util/svgs';

const shape = removeDuplicateShapes('triangle');

const svg = getShapeSvg(shape, {
  stroke: '#FF0000',
  dimensions: 12
});

const olSimpleTriangle = new OlStyle({
  image: new OlStyleIcon({
    src: OlStyleUtil.getBase64EncodedSvg(svg),
    crossOrigin: 'anonymous',
    displacement: [10, 20]
  })
});

export default olSimpleTriangle;
