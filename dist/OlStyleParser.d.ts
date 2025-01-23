import { FillSymbolizer, Filter, IconSymbolizer, LineSymbolizer, MarkSymbolizer, PointSymbolizer, ReadStyleResult, Rule, Style, StyleParser, StyleType, Symbolizer, TextSymbolizer, UnsupportedProperties, WriteStyleResult } from 'geostyler-style/dist/style';
import OlStyle, { StyleFunction as OlStyleFunction, StyleLike as OlStyleLike } from 'ol/style/Style';
import OlStyleImage from 'ol/style/Image';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleText from 'ol/style/Text';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleIcon from 'ol/style/Icon';
import OlStyleRegularshape from 'ol/style/RegularShape';
import OlFeature from 'ol/Feature';
export interface OlParserStyleFct {
    (feature?: any, resolution?: number): any;
    __geoStylerStyle: Style;
}
/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style Parser interface to work with OpenLayers styles.
 *
 * @class OlStyleParser
 * @implements StyleParser
 */
export declare class OlStyleParser implements StyleParser<OlStyleLike> {
    /**
     * The name of the OlStyleParser.
     */
    static title: string;
    unsupportedProperties: UnsupportedProperties;
    title: string;
    olIconStyleCache: any;
    OlStyleConstructor: typeof OlStyle;
    OlStyleImageConstructor: typeof OlStyleImage;
    OlStyleFillConstructor: typeof OlStyleFill;
    OlStyleStrokeConstructor: typeof OlStyleStroke;
    OlStyleTextConstructor: typeof OlStyleText;
    OlStyleCircleConstructor: typeof OlStyleCircle;
    OlStyleIconConstructor: typeof OlStyleIcon;
    OlStyleRegularshapeConstructor: typeof OlStyleRegularshape;
    constructor(ol?: any);
    isOlParserStyleFct: (x: any) => x is OlParserStyleFct;
    /**
     * Get the GeoStyler-Style PointSymbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style PointSymbolizer
     */
    getPointSymbolizerFromOlStyle(olStyle: OlStyle): PointSymbolizer;
    /**
     *
     * @param olIconStyle An ol style Icon representation
     * @returns A string or Sprite configuration
     */
    getImageFromIconStyle(olIconStyle: OlStyleIcon): IconSymbolizer['image'];
    /**
     * Get the GeoStyler-Style LineSymbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style LineSymbolizer
     */
    getLineSymbolizerFromOlStyle(olStyle: OlStyle): LineSymbolizer;
    /**
     * Get the GeoStyler-Style FillSymbolizer from an OpenLayers Style object.
     *
     * PolygonSymbolizer Stroke is just partially supported.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style FillSymbolizer
     */
    getFillSymbolizerFromOlStyle(olStyle: OlStyle): FillSymbolizer;
    /**
     * Get the GeoStyler-Style TextSymbolizer from an OpenLayers Style object.
     *
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style TextSymbolizer
     */
    getTextSymbolizerFromOlStyle(olStyle: OlStyle): TextSymbolizer;
    /**
     * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
     *
     * @param olStyles The OpenLayers Style object
     * @return The GeoStyler-Style Symbolizer array
     */
    getSymbolizersFromOlStyle(olStyles: OlStyle[]): Symbolizer[];
    /**
     * Get the GeoStyler-Style Rule from an OpenLayers Style object.
     *
     * @param olStyles The OpenLayers Style object
     * @return The GeoStyler-Style Rule
     */
    getRuleFromOlStyle(olStyles: OlStyle | OlStyle[]): Rule;
    /**
     * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style Symbolizer
     */
    getStyleTypeFromOlStyle(olStyle: OlStyle): StyleType;
    /**
     * Get the GeoStyler-Style Style from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style Style
     */
    olStyleToGeoStylerStyle(olStyle: OlStyle | OlStyle[]): Style;
    /**
     * The readStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads an OpenLayers Style, an array of OpenLayers Styles or an olParserStyleFct and returns a Promise.
     *
     * The Promise itself resolves with a GeoStyler-Style Style.
     *
     * @param olStyle The style to be parsed
     * @return The Promise resolving with the GeoStyler-Style Style
     */
    readStyle(olStyle: OlStyleLike): Promise<ReadStyleResult>;
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise.
     * The Promise itself resolves one of three types
     *
     * 1. OlStyle if input Style consists of
     *    one rule with one symbolizer, no filter, no scaleDenominator, no TextSymbolizer
     * 2. OlStyle[] if input Style consists of
     *    one rule with multiple symbolizers, no filter, no scaleDenominator, no TextSymbolizer
     * 3. OlParserStyleFct for everything else
     *
     * @param geoStylerStyle A GeoStyler-Style Style.
     * @return The Promise resolving with one of above mentioned style types.
     */
    writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<OlStyleLike>>;
    checkForUnsupportedProperties(geoStylerStyle: Style): UnsupportedProperties | undefined;
    /**
     * Decides which OlStyleType should be returned depending on given geoStylerStyle.
     * Three OlStyleTypes are possible:
     *
     * 1. OlStyle if input Style consists of
     *    one rule with one symbolizer, no filter, no scaleDenominator, no TextSymbolizer
     * 2. OlStyle[] if input Style consists of
     *    one rule with multiple symbolizers, no filter, no scaleDenominator, no TextSymbolizer
     * 3. OlParserStyleFct for everything else
     *
     * @param geoStylerStyle A GeoStyler-Style Style
     */
    getOlStyleTypeFromGeoStylerStyle(geoStylerStyle: Style): OlStyleLike | OlParserStyleFct;
    /**
     * Parses the first symbolizer of the first rule of a GeoStyler-Style Style.
     *
     * @param geoStylerStyle GeoStyler-Style Style
     * @return An OpenLayers Style Object
     */
    geoStylerStyleToOlStyle(geoStylerStyle: Style): OlStyle;
    /**
     * Parses all symbolizers of the first rule of a GeoStyler-Style Style.
     *
     * @param geoStylerStyle GeoStyler-Style Style
     * @return An array of OpenLayers Style Objects
     */
    geoStylerStyleToOlStyleArray(geoStylerStyle: Style): OlStyle[];
    /**
     * Get the OpenLayers Style object from an GeoStyler-Style Style
     *
     * @param geoStylerStyle A GeoStyler-Style Style.
     * @return An OlParserStyleFct
     */
    geoStylerStyleToOlParserStyleFct(geoStylerStyle: Style): OlParserStyleFct;
    /**
     * Checks if a feature matches given filter expression(s)
     * @param feature ol.Feature
     * @param filter Filter
     * @return boolean true if feature matches filter expression
     */
    geoStylerFilterToOlParserFilter(feature: any, filter: Filter): boolean;
    /**
     * Get the OpenLayers Style object or an OL StyleFunction from an
     * GeoStyler-Style Symbolizer.
     *
     * @param symbolizer A GeoStyler-Style Symbolizer.
     * @return The OpenLayers Style object or a StyleFunction
     */
    getOlSymbolizerFromSymbolizer(symbolizer: Symbolizer, feature?: OlFeature): OlStyle;
    /**
     * Get the OL Style object  from an GeoStyler-Style MarkSymbolizer.
     *
     * @param markSymbolizer A GeoStyler-Style MarkSymbolizer.
     * @return The OL Style object
     */
    getOlPointSymbolizerFromMarkSymbolizer(markSymbolizer: MarkSymbolizer, feature?: OlFeature): OlStyleRegularshape;
    /**
     * Get the OL Style object  from an GeoStyler-Style IconSymbolizer.
     *
     * @param symbolizer  A GeoStyler-Style IconSymbolizer.
     * @return The OL Style object
     */
    getOlIconSymbolizerFromIconSymbolizer(symbolizer: IconSymbolizer, feat?: OlFeature): OlStyle | OlStyleIcon | OlStyleFunction;
    /**
     * Get the OL Style object from an GeoStyler-Style LineSymbolizer.
     *
     * @param symbolizer A GeoStyler-Style LineSymbolizer.
     * @return The OL Style object
     */
    getOlLineSymbolizerFromLineSymbolizer(symbolizer: LineSymbolizer, feat?: OlFeature): OlStyle | OlStyleStroke;
    /**
     * Get the OL Style object from an GeoStyler-Style FillSymbolizer.
     *
     * @param symbolizer A GeoStyler-Style FillSymbolizer.
     * @return The OL Style object
     */
    getOlPolygonSymbolizerFromFillSymbolizer(symbolizer: FillSymbolizer, feat?: OlFeature): OlStyle | OlStyleFill;
    /**
     * Get the pattern for a graphicFill.
     *
     * This creates a CanvasPattern based on the
     * properties of the given PointSymbolizer. Currently,
     * only IconSymbolizer and MarkSymbolizer are supported.
     *
     * @param graphicFill The Symbolizer that holds the pattern config.
     * @returns The created CanvasPattern, or null.
     */
    getOlPatternFromGraphicFill(graphicFill: PointSymbolizer): CanvasPattern | null;
    /**
     * Get the OL StyleFunction object from an GeoStyler-Style TextSymbolizer.
     *
     * @param {TextSymbolizer} textSymbolizer A GeoStyler-Style TextSymbolizer.
     * @return {object} The OL StyleFunction
     */
    getOlTextSymbolizerFromTextSymbolizer(symbolizer: TextSymbolizer, feat?: OlFeature): OlStyle | OlStyleText | OlStyleFunction;
}
export default OlStyleParser;
