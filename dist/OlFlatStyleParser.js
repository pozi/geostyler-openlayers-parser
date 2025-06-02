import OlFlatStyleUtil from './Util/OlFlatStyleUtil';
import OlStyleUtil from './Util/OlStyleUtil';
/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style Parser interface to work with OpenLayers Flat styles.
 *
 * @class OlFlatStyleParser
 * @implements StyleParser
 */
export class OlFlatStyleParser {
    /**
     * The name of the OlFlatStyleParser.
     */
    static title = 'OpenLayers FlatStyle Parser';
    unsupportedProperties = {
        Symbolizer: {
            MarkSymbolizer: {
                wellKnownName: {
                    support: 'partial',
                    info: 'Only circle is supported'
                },
                avoidEdges: 'none',
                blur: 'none',
                fillOpacity: 'none',
                offset: 'none',
                offsetAnchor: 'none',
                pitchAlignment: 'none',
                pitchScale: 'none',
                radiusUnit: 'none',
                rotate: 'none',
                strokeWidthUnit: 'none',
                visibility: 'none'
            },
            FillSymbolizer: {
                antialias: 'none',
                fillOpacity: 'none',
                graphicFill: 'none',
                graphicFillPadding: 'none',
                outlineCap: 'none',
                outlineColor: 'none',
                outlineDasharray: 'none',
                outlineJoin: 'none',
                outlineOpacity: 'none',
                outlineWidth: 'none',
                outlineWidthUnit: 'none',
                visibility: 'none'
            },
            IconSymbolizer: {
                allowOverlap: 'none',
                anchor: 'none',
                avoidEdges: 'none',
                color: 'none',
                format: 'none',
                haloBlur: 'none',
                haloColor: 'none',
                haloOpacity: 'none',
                haloWidth: 'none',
                haloWidthUnit: 'none',
                keepUpright: 'none',
                offsetAnchor: 'none',
                optional: 'none',
                padding: 'none',
                pitchAlignment: 'none',
                rotationAlignment: 'none',
                size: 'none',
                sizeUnit: 'none',
                textFit: 'none',
                textFitPadding: 'none',
                visibility: 'none'
            },
            LineSymbolizer: {
                blur: 'none',
                gapWidth: 'none',
                gapWidthUnit: 'none',
                gradient: 'none',
                graphicFill: 'none',
                graphicFillPadding: 'none',
                graphicStroke: 'none',
                roundLimit: 'none',
                spacing: 'none',
                spacingUnit: 'none',
                visibility: 'none',
                widthUnit: 'none'
            },
            RasterSymbolizer: 'none',
            TextSymbolizer: {
                allowOverlap: 'none',
                anchor: 'none',
                avoidEdges: 'none',
                fontStyle: 'none',
                fontWeight: 'none',
                haloBlur: 'none',
                haloWidthUnit: 'none',
                keepUpright: 'none',
                letterSpacing: 'none',
                letterSpacingUnit: 'none',
                lineHeight: 'none',
                lineHeightUnit: 'none',
                maxWidth: 'none',
                offsetAnchor: 'none',
                optional: 'none',
                pitchAlignment: 'none',
                rotationAlignment: 'none',
                transform: 'none',
                visibility: 'none',
            }
        },
        Function: {
            numberFormat: 'none',
            strAbbreviate: 'none',
            strCapitalize: 'none',
            strConcat: 'none',
            strEndsWith: 'none',
            strEqualsIgnoreCase: 'none',
            strIndexOf: 'none',
            strLastIndexOf: 'none',
            strLength: 'none',
            strMatches: 'none',
            strReplace: 'none',
            strStartsWith: 'none',
            strStripAccents: 'none',
            strSubstring: 'none',
            strSubstringStart: 'none',
            strToLowerCase: 'none',
            strToUpperCase: 'none',
            strTrim: 'none',
            acos: 'none',
            asin: 'none',
            exp: 'none',
            log: 'none',
            max: 'none',
            min: 'none',
            pi: 'none',
            random: 'none',
            rint: 'none',
            tan: 'none',
            toDegrees: 'none',
            toNumber: 'none',
            toRadians: 'none',
            double2bool: 'none',
            parseBoolean: 'none',
            step: 'none'
        }
    };
    title = 'OpenLayers FlatStyle Parser';
    flatStyleToGeoStylerFillSymbolizer(flatStyle) {
        // NOTE: If fillColor is an expression, we cannot detect the opacity
        const [fillColor, fillOpacity] = OlFlatStyleUtil.isExpression(flatStyle['fill-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['fill-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['fill-color']);
        // TODO add other fill properties
        return {
            kind: 'Fill',
            color: fillColor,
            opacity: fillOpacity
        };
    }
    flatStyleToGeoStylerLineSymbolizer(flatStyle) {
        const [strokeColor, strokeOpacity] = OlFlatStyleUtil.isExpression(flatStyle['stroke-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['stroke-color']);
        // TODO add other stroke properties
        return {
            kind: 'Line',
            color: strokeColor,
            opacity: strokeOpacity,
            width: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-width']),
            cap: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-line-cap']),
            join: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-line-join']),
            dasharray: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-line-dash']),
            dashOffset: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-line-dash-offset']),
            miterLimit: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-miter-limit']),
            perpendicularOffset: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['stroke-offset'])
        };
    }
    flatStyleToGeoStylerTextSymbolizer(flatStyle) {
        const [textFillColor, textFillOpacity] = OlFlatStyleUtil.isExpression(flatStyle['text-fill-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-fill-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['text-fill-color']);
        const [textStrokeColor, textStrokeOpacity] = OlFlatStyleUtil.isExpression(flatStyle['text-stroke-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-stroke-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['text-stroke-color']);
        let font = undefined;
        let fontSize = undefined;
        if (OlFlatStyleUtil.isExpression(flatStyle['text-font'])) {
            // NOTE: If font is an expression, we cannot detect the size
            font = [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-font'])];
        }
        else if (flatStyle['text-font']) {
            font = [OlStyleUtil.getFontNameFromOlFont(flatStyle['text-font'])];
            fontSize = OlStyleUtil.getSizeFromOlFont(flatStyle['text-font']);
        }
        // TODO add missing properties
        return {
            kind: 'Text',
            label: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-value']),
            color: textFillColor,
            opacity: textFillOpacity,
            haloColor: textStrokeColor,
            haloOpacity: textStrokeOpacity,
            haloWidth: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-stroke-width']),
            font,
            size: fontSize,
            maxAngle: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-max-angle']),
            offset: [
                OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-offset-x']),
                OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-offset-y']),
            ],
            // TODO check if values of ol placement are the same as values of geostyler placement
            placement: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-placement']),
            rotate: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-rotation']),
            justify: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-justify']),
            padding: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['text-padding']),
        };
    }
    flatStyleToGeoStylerIconSymbolizer(flatStyle) {
        // TODO add missing properties
        return {
            kind: 'Icon',
            image: flatStyle['icon-src'],
            offset: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['icon-offset']),
            opacity: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['icon-opacity']),
            rotate: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['icon-rotation'])
        };
    }
    flatCircleStyleToGeoStylerMarkSymbolizer(flatStyle) {
        const [fillColor, fillOpacity] = OlFlatStyleUtil.isExpression(flatStyle['circle-fill-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['circle-fill-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['circle-fill-color']);
        const [strokeColor, strokeOpacity] = OlFlatStyleUtil.isExpression(flatStyle['circle-stroke-color'])
            ? [OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['circle-stroke-color'])]
            : OlFlatStyleUtil.getColorAndOpacity(flatStyle['circle-stroke-color']);
        // TODO add other circle properties
        return {
            kind: 'Mark',
            wellKnownName: 'circle',
            radius: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['circle-radius']),
            color: fillColor,
            opacity: fillOpacity,
            strokeColor,
            strokeOpacity,
            strokeWidth: OlFlatStyleUtil.olExpressionToGsExpression(flatStyle['circle-stroke-width']),
        };
    }
    flatStyleToGeoStylerSymbolizers(flatStyle) {
        const symbolizers = [];
        if (OlFlatStyleUtil.hasFlatFill(flatStyle)) {
            symbolizers.push(this.flatStyleToGeoStylerFillSymbolizer(flatStyle));
        }
        if (OlFlatStyleUtil.hasFlatStroke(flatStyle)) {
            symbolizers.push(this.flatStyleToGeoStylerLineSymbolizer(flatStyle));
        }
        if (OlFlatStyleUtil.hasFlatText(flatStyle)) {
            symbolizers.push(this.flatStyleToGeoStylerTextSymbolizer(flatStyle));
        }
        if (OlFlatStyleUtil.hasFlatIcon(flatStyle)) {
            symbolizers.push(this.flatStyleToGeoStylerIconSymbolizer(flatStyle));
        }
        if (OlFlatStyleUtil.hasFlatCircle(flatStyle)) {
            symbolizers.push(this.flatCircleStyleToGeoStylerMarkSymbolizer(flatStyle));
        }
        // TODO add support for FlatShape
        return symbolizers;
    }
    flatRuleToGeoStylerRule(flatRule, idx) {
        // TODO handle else rules
        let symbolizers;
        if (OlFlatStyleUtil.isFlatStyle(flatRule.style)) {
            symbolizers = this.flatStyleToGeoStylerSymbolizers(flatRule.style);
        }
        else {
            symbolizers = flatRule.style.map(this.flatStyleToGeoStylerSymbolizers, this).flat();
        }
        const rule = {
            name: `OL Style Rule ${idx}`,
            symbolizers,
        };
        if (flatRule.filter) {
            rule.filter = OlFlatStyleUtil.olFilterToGsFilter(flatRule.filter);
        }
        return rule;
    }
    flatRuleArrayToGeoStylerStyle(flatRuleArray) {
        return {
            name: 'OL Style',
            rules: flatRuleArray.map(this.flatRuleToGeoStylerRule, this)
        };
    }
    flatStyleArrayToGeoStylerStyle(flatStyleArray) {
        // We interpret FlatStyleArrays as geostyler rules without filters
        return {
            name: 'OL Style',
            rules: flatStyleArray.map((flatStyle, idx) => {
                return {
                    name: `OL Style Rule ${idx}`,
                    symbolizers: this.flatStyleToGeoStylerSymbolizers(flatStyle)
                };
            })
        };
    }
    flatStyleToGeoStylerStyle(flatStyle) {
        return {
            name: 'OL Style',
            rules: [{
                    name: 'OL Style Rule 0',
                    symbolizers: this.flatStyleToGeoStylerSymbolizers(flatStyle)
                }]
        };
    }
    flatStyleLikeToGeoStylerStyle(flatStyleLike) {
        if (OlFlatStyleUtil.isFlatStyleArray(flatStyleLike)) {
            return this.flatStyleArrayToGeoStylerStyle(flatStyleLike);
        }
        if (OlFlatStyleUtil.isFlatRuleArray(flatStyleLike)) {
            return this.flatRuleArrayToGeoStylerStyle(flatStyleLike);
        }
        if (OlFlatStyleUtil.isFlatStyle(flatStyleLike)) {
            return this.flatStyleToGeoStylerStyle(flatStyleLike);
        }
        throw new Error('Provided argument is not a valid FlatStyleLike.');
    }
    /**
     * The readStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads an OpenLayers FlatStyle and returns a Promise.
     *
     * The Promise itself resolves with a GeoStyler-Style Style.
     *
     * @param flatStyleLike The style to be parsed
     * @return The Promise resolving with the GeoStyler-Style Style
     */
    readStyle(flatStyleLike) {
        return new Promise((resolve) => {
            try {
                const geoStylerStyle = this.flatStyleLikeToGeoStylerStyle(flatStyleLike);
                // TODO add support for unsupported properties
                resolve({
                    output: geoStylerStyle
                });
            }
            catch (error) {
                resolve({
                    errors: [error]
                });
            }
        });
    }
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise containing the FlatStyle.
     *
     * @param geoStylerStyle A GeoStyler-Style Style.
     * @return The Promise resolving with one of above mentioned style types.
     */
    writeStyle(geoStylerStyle) {
        return new Promise((resolve) => {
            try {
                const flatStyle = {};
                resolve({
                    output: flatStyle,
                    warnings: ['Not implemented yet']
                });
            }
            catch (error) {
                resolve({
                    errors: [error]
                });
            }
        });
    }
}
export default OlFlatStyleParser;
//# sourceMappingURL=OlFlatStyleParser.js.map