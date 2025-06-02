import { FillSymbolizer, IconSymbolizer, LineSymbolizer, MarkSymbolizer, ReadStyleResult, Rule, Style, StyleParser, Symbolizer, TextSymbolizer, UnsupportedProperties, WriteStyleResult } from 'geostyler-style';
import { FlatStyle, FlatStyleLike, Rule as FlatRule } from 'ol/style/flat';
/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style Parser interface to work with OpenLayers Flat styles.
 *
 * @class OlFlatStyleParser
 * @implements StyleParser
 */
export declare class OlFlatStyleParser implements StyleParser<FlatStyleLike> {
    /**
     * The name of the OlFlatStyleParser.
     */
    static title: string;
    unsupportedProperties: UnsupportedProperties;
    title: string;
    flatStyleToGeoStylerFillSymbolizer(flatStyle: FlatStyle): FillSymbolizer;
    flatStyleToGeoStylerLineSymbolizer(flatStyle: FlatStyle): LineSymbolizer;
    flatStyleToGeoStylerTextSymbolizer(flatStyle: FlatStyle): TextSymbolizer;
    flatStyleToGeoStylerIconSymbolizer(flatStyle: FlatStyle): IconSymbolizer;
    flatCircleStyleToGeoStylerMarkSymbolizer(flatStyle: FlatStyle): MarkSymbolizer;
    flatStyleToGeoStylerSymbolizers(flatStyle: FlatStyle): Symbolizer[];
    flatRuleToGeoStylerRule(flatRule: FlatRule, idx: number): Rule;
    flatRuleArrayToGeoStylerStyle(flatRuleArray: FlatRule[]): Style;
    flatStyleArrayToGeoStylerStyle(flatStyleArray: FlatStyle[]): Style;
    flatStyleToGeoStylerStyle(flatStyle: FlatStyle): Style;
    flatStyleLikeToGeoStylerStyle(flatStyleLike: FlatStyleLike): Style;
    /**
     * The readStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads an OpenLayers FlatStyle and returns a Promise.
     *
     * The Promise itself resolves with a GeoStyler-Style Style.
     *
     * @param flatStyleLike The style to be parsed
     * @return The Promise resolving with the GeoStyler-Style Style
     */
    readStyle(flatStyleLike: FlatStyleLike): Promise<ReadStyleResult>;
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise containing the FlatStyle.
     *
     * @param geoStylerStyle A GeoStyler-Style Style.
     * @return The Promise resolving with one of above mentioned style types.
     */
    writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<FlatStyleLike>>;
}
export default OlFlatStyleParser;
