import { MarkSymbolizer } from 'geostyler-style';
import { svgDefinition } from './OlSvgUtil';
export declare const pointSvgs: svgDefinition;
export declare const cleanWellKnownName: (wellKnownName: string) => string;
export declare const isPointDefinedAsSvg: (wellKnownName: string) => boolean;
/**
 * Get the SVG string for a point symbolizer.
 *
 * @param symbolizer A GeoStyler-Style MarkSymbolizer.
 * @return The SVG string
 */
export declare const getPointSvg: (symbolizer: MarkSymbolizer) => string;
