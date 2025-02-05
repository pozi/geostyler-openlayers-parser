import OlStyle from 'ol/style/Style';
import { Options as OlStyleRegularshapeOptions } from 'ol/style/RegularShape';
type regularShapeOptions = {
    [key: string]: Partial<OlStyleRegularshapeOptions>;
};
export declare const staticRegularShapeOptions: regularShapeOptions;
export declare const getRegularShapeDefinition: (shape: string | undefined, shapeOpts: Partial<OlStyleRegularshapeOptions>) => OlStyle;
export declare const isPointDefinedAsRegularShape: (shape: string) => boolean;
export {};
