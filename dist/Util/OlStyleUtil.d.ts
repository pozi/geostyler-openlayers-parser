import { MarkSymbolizer, PropertyType, Style, TextSymbolizer } from 'geostyler-style/dist/style';
import { GeoStylerBooleanFunction, GeoStylerFunction, GeoStylerNumberFunction, GeoStylerStringFunction, GeoStylerUnknownFunction } from 'geostyler-style/dist/functions';
import OlFeature from 'ol/Feature';
export declare const DUMMY_MARK_SYMBOLIZER_FONT = "geostyler-mark-symbolizer";
export declare const DEGREES_TO_RADIANS: number;
/**
 * Offers some utility functions to work with OpenLayers Styles.
 */
declare class OlStyleUtil {
    /**
     * Transforms a HEX encoded color and an opacity value to a RGB(A) notation.
     *
     * @param colorString HEX encoded color
     * @param opacity  Opacity (Betweeen 0 and 1)
     * @return the RGB(A) value of the input color
     */
    static getRgbaColor(colorString: string | GeoStylerStringFunction, opacity: number | GeoStylerNumberFunction): string | undefined;
    /**
     * Splits a RGBA encoded color into its color values.
     *
     * @param {string} rgbaColor RGB(A) encoded color
     * @return {number[]} Numeric color values as array
     */
    static splitRgbaColor(rgbaColor: string): number[];
    /**
     * Transforms a RGB(A) or named color value to a HEX encoded notation.
     * If a HEX color is provided it will be returned untransformed.
     *
     * @param {string} inColor The color to transform
     * @return {string | undefined} The HEX color representation of the given color
     */
    static getHexColor(inColor: string): string | undefined;
    /**
     * Returns the hex code for a given RGB(A) array.
     *
     * @param colorArr RGB(A) array. e.g. [255,0,0]
     * @return {string} The HEX color representation of the given color
     */
    static getHexCodeFromRgbArray(colorArr: number[]): string;
    /**
     * Appends an alpha value to a HEX color code to form an RGBA-like hex code.
     *
     * @param hexColor The HEX color code to which the alpha value will be appended.
     *                 It should start with the '#' character.
     * @param opacity The opacity value between 0 and 1, representing the alpha channel.
     * @return The RGBA-like hex color code with the appended alpha value as a string,
     *         or undefined if the input hexColor is not a valid HEX color.
     */
    static getHexAlphaFromHexAndOpacity(hexColor: string, opacity: number): string | undefined;
    /**
     * Returns the opacity value of a RGB(A) color value.
     *
     * @param color RGBA or hex encoded color
     * @return {string | undefined} The opacity value of the given RGBA color
     */
    static getOpacity(color: string): number | undefined;
    /**
     * Checks if the given opacity value is valid.
     * A valid opacity is a number between 0 and 1.
     * Value 1 is ignored as this the default value.
     * If the value is not valid, false is returned.
     * @param opacity The opacity value to check
     * @return true if the opacity is valid, false otherwise
     */
    static checkOpacity(opacity: number | GeoStylerNumberFunction | undefined): boolean;
    /**
     * Returns an OL compliant font string.
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getTextFont(symbolizer: TextSymbolizer): string;
    /**
     * Returns true if the given mark symbolizer is based on a font glyph
     * (i.e. has a well known name property starting with 'ttf://').
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getIsFontGlyphBased(symbolizer: MarkSymbolizer): boolean;
    /**
     * Returns whether the given font (as used in the OpenLayers Text Style `font` property)
     * is intended for a mark symbolizer or not.
     * This is done by checking whether the dummy DUMMY_MARK_SYMBOLIZER_FONT font name is present.
     *
     * @param font The text font to analyze
     */
    static getIsMarkSymbolizerFont(font: string): boolean;
    /**
     * Returns an OL compliant font string, to be used for mark symbolizers
     * using a font glyph.
     * This also includes a dummy DUMMY_MARK_SYMBOLIZER_FONT font name at the end of the
     * string to allow determining that this font was intended for a mark symbolizer
     * later on.
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getTextFontForMarkSymbolizer(symbolizer: MarkSymbolizer): string;
    /**
     * Returns a 1-char string to be used as text for mark symbolizers using a font glyph.
     *
     * @param symbolizer The MarkSymbolizer to derive the character string from
     */
    static getCharacterForMarkSymbolizer(symbolizer: MarkSymbolizer): string;
    /**
     * Returns the font name used in the OpenLayers text style `font` property.
     *
     * @param olFont the `font` property of an OpenLayers text style
     */
    static getFontNameFromOlFont(olFont: string): string;
    /**
     * Returns the size in pixels specified in the OpenLayers text style `font` property,
     * or 0 if not found.
     *
     * @param olFont the `font` property of an OpenLayers text style
     */
    static getSizeFromOlFont(olFont: string): number;
    /**
     * Resolves the given template string with the given feature attributes, e.g.
     * the template "Size of area is {{AREA_SIZE}} km²" would be to resolved
     * to "Size of area is 1909 km²" (assuming the feature's attribute AREA_SIZE
     * really exists).
     *
     * @param feature The feature to get the attributes from.
     * @param template The template string to resolve.
     * @param [noValueFoundText] The text to apply, if the templated value
     *   could not be found, default is to 'n.v.'.
     * @param [valueAdjust] A method that will be called with each
     *   key/value match, we'll use what this function returns for the actual
     *   replacement. Optional, defaults to a function which will return the raw
     *   value it received. This can be used for last minute adjustments before
     *   replacing happens, e.g. to filter out falsy values or to do number
     *   formatting and such.
     * @return The resolved template string.
     */
    static resolveAttributeTemplate(feature: OlFeature, template: string, noValueFoundText?: string, valueAdjust?: Function): string;
    static evaluateFunction(func: GeoStylerFunction, feature?: OlFeature): PropertyType;
    static evaluateBooleanFunction(func: GeoStylerBooleanFunction, feature?: OlFeature): boolean;
    static evaluateNumberFunction(func: GeoStylerNumberFunction, feature?: OlFeature): number;
    static evaluateUnknownFunction(func: GeoStylerUnknownFunction, feature?: OlFeature): unknown;
    static evaluateStringFunction(func: GeoStylerStringFunction, feature?: OlFeature): string;
    static containsGeoStylerFunctions(style: Style): boolean;
}
export default OlStyleUtil;
