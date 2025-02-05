import OlStyle from 'ol/style/Style';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleRegularshape from 'ol/style/RegularShape';
import { DEGREES_TO_RADIANS } from './OlStyleUtil';
export const staticRegularShapeOptions = {
    square: { points: 4, angle: 45 * DEGREES_TO_RADIANS },
    triangle: { points: 3, angle: 0 },
    equilateral_triangle: { points: 3, angle: 0 },
    pentagon: { points: 5, angle: 0 },
    hexagon: { points: 6, angle: 0 },
    octagon: { points: 8, angle: 0 },
    decagon: { points: 10, angle: 0 },
    star: { points: 5, angle: 0 },
    star_diamond: { points: 4, angle: 0 },
    cross: { points: 4, radius2: 0, angle: 0 },
    cross2: { points: 4, radius2: 0, angle: 45 * DEGREES_TO_RADIANS },
    diamond: { points: 4, angle: 0 },
    backslash: { points: 2, angle: 315 * DEGREES_TO_RADIANS },
    slash: { points: 2, angle: 45 * DEGREES_TO_RADIANS },
    horline: { points: 2, angle: 90 * DEGREES_TO_RADIANS },
    carrow: { points: 3, angle: 90 * DEGREES_TO_RADIANS },
    line: { points: 2, angle: 0 }
};
export const getRegularShapeDefinition = (shape = 'circle', shapeOpts) => {
    let regularShape;
    if (shape === 'circle') {
        regularShape = new OlStyleCircle(shapeOpts);
    }
    else {
        regularShape = new OlStyleRegularshape({
            ...staticRegularShapeOptions[shape],
            ...shapeOpts
        });
    }
    return new OlStyle({
        image: regularShape
    });
};
export const isPointDefinedAsRegularShape = (shape) => shape in staticRegularShapeOptions || shape === 'circle';
//# sourceMappingURL=OlRegularShapePoints.js.map