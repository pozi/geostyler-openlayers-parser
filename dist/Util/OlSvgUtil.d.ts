import { MarkSymbolizer } from 'geostyler-style';
export declare const LINE_WELLKNOWNNAMES: string[];
export declare const NOFILL_WELLKNOWNNAMES: string[];
export type svgDefinition = Record<string, string>;
export declare const getEncodedSvg: (svgString: string) => string;
export declare const getDecodedSvg: (svgEncodedString: string) => string;
export declare const getStyleComponents: (styleString: string) => Record<string, string>;
/**
 * Extracts the properties of an SVG string into a GeoStyler-Style MarkSymbolizer.
 *
 * @param svgString the SVG string to parse
 * @returns a GeoStyler-Style MarkSymbolizer
 */
export declare const getSvgProperties: (svgString: string) => MarkSymbolizer | undefined;
export declare const drawSvgToCanvas: (svgString: string, tmpContext: CanvasRenderingContext2D, canvasSize: number, rotation: number) => void;
