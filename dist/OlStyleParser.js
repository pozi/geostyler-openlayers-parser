import { parseFont } from 'css-font-parser';
import { isGeoStylerBooleanFunction, isGeoStylerFunction, isGeoStylerStringFunction, isIconSymbolizer, isMarkSymbolizer, isSprite } from 'geostyler-style/dist/typeguards';
import OlImageState from 'ol/ImageState';
import OlGeomPoint from 'ol/geom/Point';
import OlStyle from 'ol/style/Style';
import OlStyleImage from 'ol/style/Image';
import OlStyleStroke from 'ol/style/Stroke';
import OlStyleText from 'ol/style/Text';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleFill from 'ol/style/Fill';
import OlStyleIcon from 'ol/style/Icon';
import OlStyleRegularshape from 'ol/style/RegularShape';
import { METERS_PER_UNIT } from 'ol/proj/Units';
import OlStyleUtil from './Util/OlStyleUtil';
import { getShapeSvg, getSvgProperties, isPointSvgDefined, removeDuplicateShapes } from './Util/svgs';
import { toContext } from 'ol/render';
import OlFeature from 'ol/Feature';
/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style Parser interface to work with OpenLayers styles.
 *
 * @class OlStyleParser
 * @implements StyleParser
 */
export class OlStyleParser {
    /**
     * The name of the OlStyleParser.
     */
    static title = 'OpenLayers Style Parser';
    unsupportedProperties = {
        Symbolizer: {
            MarkSymbolizer: {
                avoidEdges: 'none',
                blur: 'none',
                offsetAnchor: 'none',
                pitchAlignment: 'none',
                pitchScale: 'none'
            },
            FillSymbolizer: {
                antialias: 'none',
                opacity: {
                    support: 'none',
                    info: 'Use fillOpacity instead.'
                }
            },
            IconSymbolizer: {
                allowOverlap: 'none',
                anchor: 'none',
                avoidEdges: 'none',
                color: 'none',
                haloBlur: 'none',
                haloColor: 'none',
                haloWidth: 'none',
                keepUpright: 'none',
                offsetAnchor: 'none',
                size: {
                    support: 'partial',
                    info: 'Will set/get the width of the ol Icon.'
                },
                optional: 'none',
                padding: 'none',
                pitchAlignment: 'none',
                rotationAlignment: 'none',
                textFit: 'none',
                textFitPadding: 'none'
            },
            LineSymbolizer: {
                blur: 'none',
                gapWidth: 'none',
                gradient: 'none',
                miterLimit: 'none',
                roundLimit: 'none',
                spacing: 'none',
                graphicFill: 'none',
                graphicStroke: 'none',
                perpendicularOffset: 'none'
            },
            RasterSymbolizer: 'none',
            TextSymbolizer: {
                anchor: 'none',
                placement: {
                    support: 'partial',
                    info: 'point and line supported. line-center will be mapped to line.'
                }
            }
        },
        Function: {
            double2bool: {
                support: 'none',
                info: 'Always returns false'
            },
            atan2: {
                support: 'none',
                info: 'Currently returns the first argument'
            },
            rint: {
                support: 'none',
                info: 'Currently returns the first argument'
            },
            numberFormat: {
                support: 'none',
                info: 'Currently returns the first argument'
            },
            strAbbreviate: {
                support: 'none',
                info: 'Currently returns the first argument'
            }
        }
    };
    title = 'OpenLayers Style Parser';
    olIconStyleCache = {};
    OlStyleConstructor = OlStyle;
    OlStyleImageConstructor = OlStyleImage;
    OlStyleFillConstructor = OlStyleFill;
    OlStyleStrokeConstructor = OlStyleStroke;
    OlStyleTextConstructor = OlStyleText;
    OlStyleCircleConstructor = OlStyleCircle;
    OlStyleIconConstructor = OlStyleIcon;
    OlStyleRegularshapeConstructor = OlStyleRegularshape;
    constructor(ol) {
        if (ol) {
            this.OlStyleConstructor = ol.style.Style;
            this.OlStyleImageConstructor = ol.style.Image;
            this.OlStyleFillConstructor = ol.style.Fill;
            this.OlStyleStrokeConstructor = ol.style.Stroke;
            this.OlStyleTextConstructor = ol.style.Text;
            this.OlStyleCircleConstructor = ol.style.Circle;
            this.OlStyleIconConstructor = ol.style.Icon;
            this.OlStyleRegularshapeConstructor = ol.style.RegularShape;
        }
    }
    isOlParserStyleFct = (x) => {
        return typeof x === 'function';
    };
    /**
     * Get the GeoStyler-Style PointSymbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style PointSymbolizer
     */
    getPointSymbolizerFromOlStyle(olStyle) {
        let pointSymbolizer;
        if (olStyle.getImage() instanceof this.OlStyleCircleConstructor) {
            // circle
            const olCircleStyle = olStyle.getImage();
            const olFillStyle = olCircleStyle.getFill();
            const olStrokeStyle = olCircleStyle.getStroke();
            const offset = olCircleStyle.getDisplacement();
            const circleSymbolizer = {
                kind: 'Mark',
                wellKnownName: 'circle',
                color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor()) : undefined,
                opacity: olCircleStyle.getOpacity() !== 1 ? olCircleStyle.getOpacity() : undefined,
                fillOpacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor()) : undefined,
                radius: (olCircleStyle.getRadius() !== 0) ? olCircleStyle.getRadius() : 5,
                strokeColor: olStrokeStyle ? olStrokeStyle.getColor() : undefined,
                strokeOpacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor()) : undefined,
                strokeWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
                offset: offset[0] || offset[1] ? offset : undefined
            };
            pointSymbolizer = circleSymbolizer;
        }
        else if (olStyle.getImage() instanceof this.OlStyleRegularshapeConstructor) {
            // square, triangle, star, cross or x
            const olRegularStyle = olStyle.getImage();
            const olFillStyle = olRegularStyle.getFill();
            const olStrokeStyle = olRegularStyle.getStroke();
            const radius = olRegularStyle.getRadius();
            const radius2 = olRegularStyle.getRadius2();
            const points = olRegularStyle.getPoints();
            const angle = olRegularStyle.getAngle();
            const offset = olRegularStyle.getDisplacement();
            const markSymbolizer = {
                kind: 'Mark',
                color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor()) : undefined,
                opacity: olRegularStyle.getOpacity() !== 1 ? olRegularStyle.getOpacity() : undefined,
                fillOpacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor()) : undefined,
                strokeColor: olStrokeStyle ? olStrokeStyle.getColor() : undefined,
                strokeOpacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor()) : undefined,
                strokeWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
                radius: (radius !== 0) ? radius : 5,
                // Rotation in openlayers is radians while we use degree
                rotate: olRegularStyle.getRotation() / Math.PI * 180,
                offset: offset[0] || offset[1] ? offset : undefined
            };
            switch (points) {
                case 2:
                    switch (angle) {
                        case 0:
                            markSymbolizer.wellKnownName = 'shape://vertline';
                            break;
                        case Math.PI / 2:
                            markSymbolizer.wellKnownName = 'shape://horline';
                            break;
                        case Math.PI / 4:
                            markSymbolizer.wellKnownName = 'shape://slash';
                            break;
                        case 2 * Math.PI - (Math.PI / 4):
                            markSymbolizer.wellKnownName = 'shape://backslash';
                            break;
                        default:
                            break;
                    }
                    break;
                case 3:
                    switch (angle) {
                        case 0:
                            markSymbolizer.wellKnownName = 'triangle';
                            break;
                        case Math.PI / 2:
                            markSymbolizer.wellKnownName = 'shape://carrow';
                            break;
                        default:
                            break;
                    }
                    break;
                case 4:
                    if (Number.isFinite(radius2)) {
                        // cross or x
                        if (olRegularStyle.getAngle() === 0) {
                            // cross
                            markSymbolizer.wellKnownName = 'cross';
                        }
                        else {
                            // x
                            markSymbolizer.wellKnownName = 'x';
                        }
                    }
                    else {
                        // square
                        markSymbolizer.wellKnownName = 'square';
                    }
                    break;
                case 5:
                    // star
                    markSymbolizer.wellKnownName = 'star';
                    break;
                default:
                    throw new Error('Could not parse OlStyle. Only 2, 3, 4 or 5 point regular shapes are allowed');
            }
            pointSymbolizer = markSymbolizer;
        }
        else if (olStyle.getText() instanceof this.OlStyleTextConstructor) {
            const olTextStyle = olStyle.getText();
            const olFillStyle = olTextStyle.getFill();
            const olStrokeStyle = olTextStyle.getStroke();
            const rotation = olTextStyle.getRotation();
            let char = olTextStyle.getText() || 'a';
            const font = olTextStyle.getFont() || '10px sans-serif';
            const fontName = OlStyleUtil.getFontNameFromOlFont(font);
            const radius = OlStyleUtil.getSizeFromOlFont(font);
            const offset = [olTextStyle.getOffsetX(), olTextStyle.getOffsetY()];
            if (Array.isArray(char)) {
                char = char[0];
            }
            pointSymbolizer = {
                kind: 'Mark',
                wellKnownName: `ttf://${fontName}#0x${char.charCodeAt(0).toString(16)}`,
                color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor()) : undefined,
                opacity: olFillStyle ? OlStyleUtil.getOpacity(olFillStyle.getColor()) : undefined,
                strokeColor: olStrokeStyle ? olStrokeStyle.getColor() : undefined,
                strokeOpacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor()) : undefined,
                strokeWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
                radius: (radius !== 0) ? radius : 5,
                // Rotation in openlayers is radians while we use degree
                rotate: rotation ? rotation / Math.PI * 180 : 0,
                offset: offset[0] || offset[1] ? offset : undefined
            };
        }
        else {
            // icon
            const olIconStyle = olStyle.getImage();
            const displacement = olIconStyle.getDisplacement();
            // initialOptions_ as fallback when image is not yet loaded
            // this always gets calculated from ol so this might not have been set initially
            let size = olIconStyle.getWidth();
            const rotation = olIconStyle.getRotation() / Math.PI * 180;
            const opacity = olIconStyle.getOpacity();
            // If the image is an SVG string try to extract the properties and build a MarkSymbolizer
            try {
                const svgString = OlStyleUtil.getBase64DecodedSvg(olIconStyle.getSrc());
                const { id, dimensions, fill, stroke, strokeWidth } = getSvgProperties(svgString);
                const strokeOpacity = stroke
                    ? OlStyleUtil.getOpacity(stroke) !== 1
                        ? OlStyleUtil.getOpacity(stroke)
                        : undefined
                    : undefined;
                pointSymbolizer = {
                    kind: 'Mark',
                    wellKnownName: id,
                    ...fill && { color: fill },
                    ...(opacity !== undefined && opacity !== 1 && { opacity }),
                    ...stroke && { strokeColor: stroke.substring(0, 7) },
                    ...strokeWidth !== undefined && { strokeWidth },
                    ...strokeOpacity !== undefined && { strokeOpacity },
                    ...(dimensions / 2 !== 0 && { radius: dimensions / 2 }),
                    ...(rotation !== undefined && rotation !== 0 && { rotate: rotation }),
                    ...((displacement[0] || displacement[1]) && { offset: displacement }),
                };
            }
            catch {
                // initialOptions_ as fallback when image is not yet loaded
                const image = this.getImageFromIconStyle(olIconStyle);
                const iconSymbolizer = {
                    kind: 'Icon',
                    image,
                    opacity: opacity < 1 ? opacity : undefined,
                    size,
                    // Rotation in openlayers is radians while we use degree
                    rotate: rotation !== 0 ? rotation : undefined,
                    offset: displacement[0] || displacement[1] ? displacement : undefined
                };
                pointSymbolizer = iconSymbolizer;
            }
        }
        return pointSymbolizer;
    }
    /**
     *
     * @param olIconStyle An ol style Icon representation
     * @returns A string or Sprite configuration
     */
    getImageFromIconStyle(olIconStyle) {
        const size = olIconStyle.getSize();
        if (Array.isArray(size)) {
            // TODO: create getters (and setters?) in openlayers
            // @ts-ignore
            let position = olIconStyle.offset_;
            // @ts-ignore
            const offsetOrigin = olIconStyle.offsetOrigin_;
            if (offsetOrigin && offsetOrigin !== 'top-left') {
                throw new Error(`Offset origin ${offsetOrigin} not supported`);
            }
            return {
                source: olIconStyle.getSrc(),
                position,
                size: size
            };
        }
        else {
            return olIconStyle.getSrc() ? olIconStyle.getSrc() : undefined;
        }
    }
    /**
     * Get the GeoStyler-Style LineSymbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style LineSymbolizer
     */
    getLineSymbolizerFromOlStyle(olStyle) {
        const olStrokeStyle = olStyle.getStroke();
        // getLineDash returns null not undefined. So we have to double check
        const dashArray = olStrokeStyle ? olStrokeStyle.getLineDash() : undefined;
        return {
            kind: 'Line',
            color: olStrokeStyle ? OlStyleUtil.getHexColor(olStrokeStyle.getColor()) : undefined,
            opacity: olStrokeStyle ? OlStyleUtil.getOpacity(olStrokeStyle.getColor()) : undefined,
            width: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
            cap: olStrokeStyle ? olStrokeStyle.getLineCap() : 'butt',
            join: olStrokeStyle ? olStrokeStyle.getLineJoin() : 'miter',
            dasharray: dashArray ? dashArray : undefined,
            dashOffset: olStrokeStyle ? olStrokeStyle.getLineDashOffset() : undefined
        };
    }
    /**
     * Get the GeoStyler-Style FillSymbolizer from an OpenLayers Style object.
     *
     * PolygonSymbolizer Stroke is just partially supported.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style FillSymbolizer
     */
    getFillSymbolizerFromOlStyle(olStyle) {
        const olFillStyle = olStyle.getFill();
        const olStrokeStyle = olStyle.getStroke();
        // getLineDash returns null not undefined. So we have to double check
        const outlineDashArray = olStrokeStyle ? olStrokeStyle.getLineDash() : undefined;
        const symbolizer = {
            kind: 'Fill'
        };
        if (olFillStyle) {
            symbolizer.color = OlStyleUtil.getHexColor(olFillStyle.getColor());
        }
        if (olFillStyle) {
            symbolizer.fillOpacity = OlStyleUtil.getOpacity(olFillStyle.getColor());
        }
        if (olStrokeStyle) {
            symbolizer.outlineColor = OlStyleUtil.getHexColor(olStrokeStyle.getColor());
        }
        if (outlineDashArray) {
            symbolizer.outlineDasharray = outlineDashArray;
        }
        if (olStrokeStyle) {
            symbolizer.outlineOpacity = OlStyleUtil.getOpacity(olStrokeStyle.getColor());
        }
        if (olStrokeStyle && olStrokeStyle.getWidth()) {
            symbolizer.outlineWidth = olStrokeStyle.getWidth();
        }
        return symbolizer;
    }
    /**
     * Get the GeoStyler-Style TextSymbolizer from an OpenLayers Style object.
     *
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style TextSymbolizer
     */
    getTextSymbolizerFromOlStyle(olStyle) {
        const olTextStyle = olStyle.getText();
        if (!olTextStyle) {
            throw new Error('Could not get text from olStyle.');
        }
        const olFillStyle = olTextStyle.getFill();
        const olStrokeStyle = olTextStyle.getStroke();
        const offsetX = olTextStyle.getOffsetX();
        const offsetY = olTextStyle.getOffsetY();
        const font = olTextStyle.getFont();
        const rotation = olTextStyle.getRotation();
        const allowOverlap = olTextStyle.getOverflow() ? olTextStyle.getOverflow() : undefined;
        const placement = olTextStyle.getPlacement();
        const text = olTextStyle.getText();
        const label = Array.isArray(text) ? text[0] : text;
        let fontSize = Infinity;
        let fontFamily = undefined;
        let fontWeight = undefined;
        let fontStyle = undefined;
        if (font) {
            const fontObj = parseFont(font);
            if (fontObj['font-weight']) {
                fontWeight = fontObj['font-weight'];
            }
            if (fontObj['font-size']) {
                fontSize = parseInt(fontObj['font-size'], 10);
            }
            if (fontObj['font-family']) {
                const fontFamilies = fontObj['font-family'];
                fontFamily = fontFamilies?.map((f) => f.includes(' ') ? '"' + f + '"' : f);
            }
            if (fontObj['font-style']) {
                fontStyle = fontObj['font-style'];
            }
        }
        return {
            kind: 'Text',
            label,
            placement,
            allowOverlap,
            color: olFillStyle ? OlStyleUtil.getHexColor(olFillStyle.getColor()) : undefined,
            size: isFinite(fontSize) ? fontSize : undefined,
            font: fontFamily,
            fontWeight: fontWeight || undefined,
            fontStyle: fontStyle || undefined,
            offset: (offsetX !== undefined) && (offsetY !== undefined) ? [offsetX, offsetY] : [0, 0],
            haloColor: olStrokeStyle && olStrokeStyle.getColor() ?
                OlStyleUtil.getHexColor(olStrokeStyle.getColor()) : undefined,
            haloWidth: olStrokeStyle ? olStrokeStyle.getWidth() : undefined,
            rotate: (rotation !== undefined) ? rotation / Math.PI * 180 : undefined
        };
    }
    /**
     * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
     *
     * @param olStyles The OpenLayers Style object
     * @return The GeoStyler-Style Symbolizer array
     */
    getSymbolizersFromOlStyle(olStyles) {
        const symbolizers = [];
        olStyles.forEach(olStyle => {
            let symbolizer;
            const styleType = this.getStyleTypeFromOlStyle(olStyle);
            switch (styleType) {
                case 'Point':
                    if (olStyle.getText() && !OlStyleUtil.getIsMarkSymbolizerFont(olStyle.getText().getFont())) {
                        symbolizer = this.getTextSymbolizerFromOlStyle(olStyle);
                    }
                    else {
                        symbolizer = this.getPointSymbolizerFromOlStyle(olStyle);
                    }
                    break;
                case 'Line':
                    symbolizer = this.getLineSymbolizerFromOlStyle(olStyle);
                    break;
                case 'Fill':
                    symbolizer = this.getFillSymbolizerFromOlStyle(olStyle);
                    break;
                default:
                    throw new Error('Failed to parse SymbolizerKind from OpenLayers Style');
            }
            symbolizers.push(symbolizer);
        });
        return symbolizers;
    }
    /**
     * Get the GeoStyler-Style Rule from an OpenLayers Style object.
     *
     * @param olStyles The OpenLayers Style object
     * @return The GeoStyler-Style Rule
     */
    getRuleFromOlStyle(olStyles) {
        let symbolizers;
        const name = 'OL Style Rule 0';
        if (Array.isArray(olStyles)) {
            symbolizers = this.getSymbolizersFromOlStyle(olStyles);
        }
        else {
            symbolizers = this.getSymbolizersFromOlStyle([olStyles]);
        }
        return {
            name, symbolizers
        };
    }
    /**
     * Get the GeoStyler-Style Symbolizer from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style Symbolizer
     */
    getStyleTypeFromOlStyle(olStyle) {
        let styleType;
        if (olStyle.getImage() instanceof this.OlStyleImageConstructor) {
            styleType = 'Point';
        }
        else if (olStyle.getText() instanceof this.OlStyleTextConstructor) {
            styleType = 'Point';
        }
        else if (olStyle.getFill() instanceof this.OlStyleFillConstructor) {
            styleType = 'Fill';
        }
        else if (olStyle.getStroke() && !olStyle.getFill()) {
            styleType = 'Line';
        }
        else {
            throw new Error('StyleType could not be detected');
        }
        return styleType;
    }
    /**
     * Get the GeoStyler-Style Style from an OpenLayers Style object.
     *
     * @param olStyle The OpenLayers Style object
     * @return The GeoStyler-Style Style
     */
    olStyleToGeoStylerStyle(olStyle) {
        const name = 'OL Style';
        const rule = this.getRuleFromOlStyle(olStyle);
        return {
            name,
            rules: [rule]
        };
    }
    /**
     * The readStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads an OpenLayers Style, an array of OpenLayers Styles or an olParserStyleFct and returns a Promise.
     *
     * The Promise itself resolves with a GeoStyler-Style Style.
     *
     * @param olStyle The style to be parsed
     * @return The Promise resolving with the GeoStyler-Style Style
     */
    readStyle(olStyle) {
        return new Promise((resolve) => {
            try {
                if (this.isOlParserStyleFct(olStyle)) {
                    resolve({
                        output: olStyle.__geoStylerStyle
                    });
                }
                else {
                    olStyle = olStyle;
                    const geoStylerStyle = this.olStyleToGeoStylerStyle(olStyle);
                    const unsupportedProperties = this.checkForUnsupportedProperties(geoStylerStyle);
                    resolve({
                        output: geoStylerStyle,
                        unsupportedProperties
                    });
                }
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
    writeStyle(geoStylerStyle) {
        return new Promise(async (resolve) => {
            const clonedStyle = structuredClone(geoStylerStyle);
            const unsupportedProperties = this.checkForUnsupportedProperties(clonedStyle);
            try {
                const olStyle = await this.getOlStyleTypeFromGeoStylerStyle(clonedStyle);
                resolve({
                    output: olStyle,
                    unsupportedProperties,
                    warnings: unsupportedProperties && ['Your style contains unsupportedProperties!']
                });
            }
            catch (error) {
                resolve({
                    errors: [error]
                });
            }
        });
    }
    checkForUnsupportedProperties(geoStylerStyle) {
        const capitalizeFirstLetter = (a) => a[0].toUpperCase() + a.slice(1);
        const unsupportedProperties = {};
        geoStylerStyle.rules.forEach(rule => {
            // ScaleDenominator and Filters are completly supported so we just check for symbolizers
            rule.symbolizers.forEach(symbolizer => {
                const key = capitalizeFirstLetter(`${symbolizer.kind}Symbolizer`);
                const value = this.unsupportedProperties?.Symbolizer?.[key];
                if (value) {
                    if (typeof value === 'string') {
                        if (!unsupportedProperties.Symbolizer) {
                            unsupportedProperties.Symbolizer = {};
                        }
                        unsupportedProperties.Symbolizer[key] = value;
                    }
                    else {
                        Object.keys(symbolizer).forEach(property => {
                            if (value[property]) {
                                if (!unsupportedProperties.Symbolizer) {
                                    unsupportedProperties.Symbolizer = {};
                                }
                                if (!unsupportedProperties.Symbolizer[key]) {
                                    unsupportedProperties.Symbolizer[key] = {};
                                }
                                unsupportedProperties.Symbolizer[key][property] = value[property];
                            }
                        });
                    }
                }
            });
        });
        if (Object.keys(unsupportedProperties).length > 0) {
            return unsupportedProperties;
        }
        return undefined;
    }
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
    async getOlStyleTypeFromGeoStylerStyle(geoStylerStyle) {
        const rules = geoStylerStyle.rules;
        const nrRules = rules.length;
        if (nrRules === 1) {
            const hasFilter = geoStylerStyle?.rules?.[0]?.filter !== undefined ? true : false;
            const hasMinScale = geoStylerStyle?.rules?.[0]?.scaleDenominator?.min !== undefined ? true : false;
            const hasMaxScale = geoStylerStyle?.rules?.[0]?.scaleDenominator?.max !== undefined ? true : false;
            const hasScaleDenominator = hasMinScale || hasMaxScale ? true : false;
            const hasFunctions = OlStyleUtil.containsGeoStylerFunctions(geoStylerStyle);
            const nrSymbolizers = geoStylerStyle.rules[0].symbolizers.length;
            const hasTextSymbolizer = rules[0].symbolizers.some((symbolizer) => {
                return symbolizer.kind === 'Text';
            });
            const hasDynamicIconSymbolizer = rules[0].symbolizers.some((symbolizer) => {
                return symbolizer.kind === 'Icon' && typeof (symbolizer.image) === 'string' && symbolizer.image.includes('{{');
            });
            if (!hasFilter && !hasScaleDenominator && !hasTextSymbolizer && !hasDynamicIconSymbolizer && !hasFunctions) {
                if (nrSymbolizers === 1) {
                    return await this.geoStylerStyleToOlStyle(geoStylerStyle);
                }
                else {
                    return await this.geoStylerStyleToOlStyleArray(geoStylerStyle);
                }
            }
            else {
                return await this.geoStylerStyleToOlParserStyleFct(geoStylerStyle);
            }
        }
        else {
            return await this.geoStylerStyleToOlParserStyleFct(geoStylerStyle);
        }
    }
    /**
     * Parses the first symbolizer of the first rule of a GeoStyler-Style Style.
     *
     * @param geoStylerStyle GeoStyler-Style Style
     * @return An OpenLayers Style Object
     */
    async geoStylerStyleToOlStyle(geoStylerStyle) {
        const rule = geoStylerStyle.rules[0];
        const symbolizer = rule.symbolizers[0];
        const olSymbolizer = await this.getOlSymbolizerFromSymbolizer(symbolizer);
        return olSymbolizer;
    }
    /**
     * Parses all symbolizers of the first rule of a GeoStyler-Style Style.
     *
     * @param geoStylerStyle GeoStyler-Style Style
     * @return An array of OpenLayers Style Objects
     */
    async geoStylerStyleToOlStyleArray(geoStylerStyle) {
        const rule = geoStylerStyle.rules[0];
        const olStyles = [];
        rule.symbolizers.forEach(async (symbolizer) => {
            const olSymbolizer = await this.getOlSymbolizerFromSymbolizer(symbolizer);
            olStyles.push(olSymbolizer);
        });
        return olStyles;
    }
    /**
     * Get the OpenLayers Style object from an GeoStyler-Style Style
     *
     * @param geoStylerStyle A GeoStyler-Style Style.
     * @return An OlParserStyleFct
     */
    async geoStylerStyleToOlParserStyleFct(geoStylerStyle) {
        const rules = structuredClone(geoStylerStyle.rules);
        const olStyle = (feature, resolution) => {
            const styles = [];
            // calculate scale for resolution (from ol-util MapUtil)
            const dpi = 25.4 / 0.28;
            const mpu = METERS_PER_UNIT.m;
            const inchesPerMeter = 39.37;
            const scale = resolution * mpu * inchesPerMeter * dpi;
            rules.forEach((rule) => {
                // handling scale denominator
                let minScale = rule?.scaleDenominator?.min;
                let maxScale = rule?.scaleDenominator?.max;
                let isWithinScale = true;
                if (minScale || maxScale) {
                    minScale = isGeoStylerFunction(minScale) ? OlStyleUtil.evaluateNumberFunction(minScale) : minScale;
                    maxScale = isGeoStylerFunction(maxScale) ? OlStyleUtil.evaluateNumberFunction(maxScale) : maxScale;
                    if (minScale && scale < minScale) {
                        isWithinScale = false;
                    }
                    if (maxScale && scale >= maxScale) {
                        isWithinScale = false;
                    }
                }
                // handling filter
                let matchesFilter = false;
                if (!rule.filter) {
                    matchesFilter = true;
                }
                else {
                    try {
                        matchesFilter = this.geoStylerFilterToOlParserFilter(feature, rule.filter);
                    }
                    catch (e) {
                        matchesFilter = false;
                    }
                }
                if (isWithinScale && matchesFilter) {
                    rule.symbolizers.forEach(async (symb) => {
                        if (symb.visibility === false) {
                            styles.push(null);
                        }
                        if (isGeoStylerBooleanFunction(symb.visibility)) {
                            const visibility = OlStyleUtil.evaluateBooleanFunction(symb.visibility);
                            if (!visibility) {
                                styles.push(null);
                            }
                        }
                        const olSymbolizer = await this.getOlSymbolizerFromSymbolizer(symb, feature);
                        // either an OlStyle or an ol.StyleFunction. OpenLayers only accepts an array
                        // of OlStyles, not ol.StyleFunctions.
                        // So we have to check it and in case of an ol.StyleFunction call that function
                        // and add the returned style to const styles.
                        if (typeof olSymbolizer !== 'function') {
                            styles.push(olSymbolizer);
                        }
                        else {
                            const styleFromFct = olSymbolizer(feature, resolution);
                            styles.push(styleFromFct);
                        }
                    });
                }
            });
            return styles;
        };
        const olStyleFct = olStyle;
        olStyleFct.__geoStylerStyle = geoStylerStyle;
        return olStyleFct;
    }
    /**
     * Checks if a feature matches given filter expression(s)
     * @param feature ol.Feature
     * @param filter Filter
     * @return boolean true if feature matches filter expression
     */
    geoStylerFilterToOlParserFilter(feature, filter) {
        const operatorMapping = {
            '&&': true,
            '||': true,
            '!': true
        };
        let matchesFilter = true;
        if (isGeoStylerBooleanFunction(filter)) {
            return OlStyleUtil.evaluateBooleanFunction(filter, feature);
        }
        if (filter === true || filter === false) {
            return filter;
        }
        const operator = filter[0];
        let isNestedFilter = false;
        if (operatorMapping[operator]) {
            isNestedFilter = true;
        }
        try {
            if (isNestedFilter) {
                let intermediate;
                let restFilter;
                switch (filter[0]) {
                    case '&&':
                        intermediate = true;
                        restFilter = filter.slice(1);
                        restFilter.forEach((f) => {
                            if (!this.geoStylerFilterToOlParserFilter(feature, f)) {
                                intermediate = false;
                            }
                        });
                        matchesFilter = intermediate;
                        break;
                    case '||':
                        intermediate = false;
                        restFilter = filter.slice(1);
                        restFilter.forEach((f) => {
                            if (this.geoStylerFilterToOlParserFilter(feature, f)) {
                                intermediate = true;
                            }
                        });
                        matchesFilter = intermediate;
                        break;
                    case '!':
                        matchesFilter = !this.geoStylerFilterToOlParserFilter(feature, filter[1]);
                        break;
                    default:
                        throw new Error('Cannot parse Filter. Unknown combination or negation operator.');
                }
            }
            else {
                let arg1;
                if (isGeoStylerFunction(filter[1])) {
                    arg1 = OlStyleUtil.evaluateFunction(filter[1], feature);
                }
                else {
                    arg1 = feature.get(filter[1]);
                }
                let arg2;
                if (isGeoStylerFunction(filter[2])) {
                    arg2 = OlStyleUtil.evaluateFunction(filter[2], feature);
                }
                else {
                    arg2 = filter[2];
                }
                switch (filter[0]) {
                    case '==':
                        matchesFilter = ('' + arg1) === ('' + arg2);
                        break;
                    case '*=':
                        // inspired by
                        // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
                        if (typeof arg2 === 'string' && typeof arg1 === 'string') {
                            if (arg2.length > arg1.length) {
                                matchesFilter = false;
                            }
                            else {
                                matchesFilter = arg1.indexOf(arg2) !== -1;
                            }
                        }
                        break;
                    case '!=':
                        matchesFilter = ('' + arg1) !== ('' + arg2);
                        break;
                    case '<':
                        matchesFilter = Number(arg1) < Number(arg2);
                        break;
                    case '<=':
                        matchesFilter = Number(arg1) <= Number(arg2);
                        break;
                    case '>':
                        matchesFilter = Number(arg1) > Number(arg2);
                        break;
                    case '>=':
                        matchesFilter = Number(arg1) >= Number(arg2);
                        break;
                    default:
                        throw new Error('Cannot parse Filter. Unknown comparison operator.');
                }
            }
        }
        catch (e) {
            throw new Error('Cannot parse Filter. Invalid structure.');
        }
        return matchesFilter;
    }
    /**
     * Get the OpenLayers Style object or an OL StyleFunction from an
     * GeoStyler-Style Symbolizer.
     *
     * @param symbolizer A GeoStyler-Style Symbolizer.
     * @return The OpenLayers Style object or a StyleFunction
     */
    async getOlSymbolizerFromSymbolizer(symbolizer, feature) {
        let olSymbolizer;
        symbolizer = structuredClone(symbolizer);
        switch (symbolizer.kind) {
            case 'Mark':
                olSymbolizer = await this.getOlPointSymbolizerFromMarkSymbolizer(symbolizer, feature);
                break;
            case 'Icon':
                olSymbolizer = await this.getOlIconSymbolizerFromIconSymbolizer(symbolizer, feature);
                break;
            case 'Text':
                olSymbolizer = this.getOlTextSymbolizerFromTextSymbolizer(symbolizer, feature);
                break;
            case 'Line':
                olSymbolizer = this.getOlLineSymbolizerFromLineSymbolizer(symbolizer, feature);
                break;
            case 'Fill':
                olSymbolizer = await this.getOlPolygonSymbolizerFromFillSymbolizer(symbolizer, feature);
                break;
            default:
                // Return the OL default style since the TS type binding does not allow
                // us to set olSymbolizer to undefined
                const fill = new this.OlStyleFillConstructor({
                    color: 'rgba(255,255,255,0.4)'
                });
                const stroke = new this.OlStyleStrokeConstructor({
                    color: '#3399CC',
                    width: 1.25
                });
                olSymbolizer = new this.OlStyleConstructor({
                    image: new this.OlStyleCircleConstructor({
                        fill: fill,
                        stroke: stroke,
                        radius: 5
                    }),
                    fill: fill,
                    stroke: stroke
                });
                break;
        }
        return olSymbolizer;
    }
    /**
     * Get the OL Style object  from an GeoStyler-Style MarkSymbolizer.
     *
     * @param markSymbolizer A GeoStyler-Style MarkSymbolizer.
     * @return The OL Style object
     */
    async getOlPointSymbolizerFromMarkSymbolizer(markSymbolizer, feature) {
        for (const key of Object.keys(markSymbolizer)) {
            if (isGeoStylerFunction(markSymbolizer[key])) {
                markSymbolizer[key] = OlStyleUtil.evaluateFunction(markSymbolizer[key], feature);
            }
        }
        const strokeColor = markSymbolizer.strokeColor;
        const strokeOpacity = markSymbolizer.strokeOpacity;
        const strokeWidth = markSymbolizer.strokeWidth;
        const fillColor = markSymbolizer.color;
        const fillOpacity = markSymbolizer.fillOpacity;
        const rotation = (Number(markSymbolizer.rotate) * Math.PI) / 180;
        const displacement = markSymbolizer.offset;
        let olStyle;
        let shape = removeDuplicateShapes(markSymbolizer.wellKnownName);
        if (isPointSvgDefined(shape)) {
            const dimensions = (markSymbolizer?.radius ?? 6) * 2; // Default to 12 pixels
            const opacity = markSymbolizer.opacity;
            const svgOpts = {
                dimensions,
                ...(fillColor && { fill: fillColor }),
                ...(fillOpacity && { fillOpacity }),
                ...(strokeColor && { stroke: strokeColor }),
                ...(strokeWidth && { strokeWidth }),
                ...(strokeOpacity && { strokeOpacity })
            };
            const svg = getShapeSvg(shape, svgOpts);
            // olStyle = OlStyleUtil.createIconStyleFromSvg(svg);
            olStyle = new this.OlStyleConstructor({
                image: new this.OlStyleIconConstructor({
                    src: OlStyleUtil.getBase64EncodedSvg(svg),
                    crossOrigin: 'anonymous',
                    ...(displacement && { displacement }),
                    ...(opacity && Number.isFinite(opacity) && { opacity }),
                    ...(rotation && { rotation }),
                    scale: 1,
                }),
            });
        }
        else if (OlStyleUtil.getIsFontGlyphBased(markSymbolizer)) {
            const strokeRgbaColor = (strokeColor && strokeOpacity ?
                OlStyleUtil.getRgbaColor(strokeColor, strokeOpacity) :
                strokeColor);
            const fillRgbaColor = (fillColor && fillOpacity ?
                OlStyleUtil.getRgbaColor(fillColor, fillOpacity) :
                fillColor);
            const stroke = new this.OlStyleStrokeConstructor({
                ...(strokeRgbaColor && { color: strokeRgbaColor }),
                ...(strokeWidth && { width: strokeWidth })
            });
            const fill = new this.OlStyleFillConstructor({
                ...(fillRgbaColor && { color: fillRgbaColor })
            });
            olStyle = new this.OlStyleConstructor({
                text: new this.OlStyleTextConstructor({
                    text: OlStyleUtil.getCharacterForMarkSymbolizer(markSymbolizer),
                    font: OlStyleUtil.getTextFontForMarkSymbolizer(markSymbolizer),
                    ...(fill && { fill }),
                    ...(displacement && { offsetX: displacement[0] }),
                    ...(displacement && { offsetY: displacement[1] }),
                    ...(stroke && { stroke }),
                    ...(rotation && { rotation }),
                })
            });
        }
        else {
            throw new Error('MarkSymbolizer cannot be parsed. Unsupported WellKnownName.');
        }
        return olStyle;
    }
    /**
     * Get the OL Style object  from an GeoStyler-Style IconSymbolizer.
     *
     * @param symbolizer  A GeoStyler-Style IconSymbolizer.
     * @return The OL Style object
     */
    async getOlIconSymbolizerFromIconSymbolizer(symbolizer, feat) {
        for (const key of Object.keys(symbolizer)) {
            if (isGeoStylerFunction(symbolizer[key])) {
                symbolizer[key] = OlStyleUtil.evaluateFunction(symbolizer[key], feat);
            }
        }
        const baseProps = {
            src: isSprite(symbolizer.image) ? symbolizer.image.source : symbolizer.image,
            crossOrigin: 'anonymous',
            opacity: symbolizer.opacity,
            width: symbolizer.size,
            // Rotation in openlayers is radians while we use degree
            rotation: (typeof (symbolizer.rotate) === 'number' ? symbolizer.rotate * Math.PI / 180 : undefined),
            displacement: symbolizer.offset,
            size: isSprite(symbolizer.image) ? symbolizer.image.size : undefined,
            offset: isSprite(symbolizer.image) ? symbolizer.image.position : undefined,
        };
        // check if IconSymbolizer.image contains a placeholder
        const prefix = '\\{\\{';
        const suffix = '\\}\\}';
        const regExp = new RegExp(prefix + '.*?' + suffix, 'g');
        const regExpRes = typeof (symbolizer.image) === 'string' ? symbolizer.image.match(regExp) : null;
        if (regExpRes) {
            // if it contains a placeholder
            // return olStyleFunction
            const olPointStyledIconFn = (feature) => {
                let src = OlStyleUtil.resolveAttributeTemplate(feature, symbolizer.image, '');
                // src can't be blank, would trigger ol errors
                if (!src) {
                    src = symbolizer.image + '';
                }
                let image;
                if (this.olIconStyleCache[src]) {
                    image = this.olIconStyleCache[src];
                    if (baseProps.rotation !== undefined) {
                        image.setRotation(baseProps.rotation);
                    }
                    if (baseProps.opacity !== undefined) {
                        image.setOpacity(baseProps.opacity);
                    }
                }
                else {
                    image = new this.OlStyleIconConstructor({
                        ...baseProps,
                        src // order is important
                    });
                    this.olIconStyleCache[src] = image;
                }
                const style = new this.OlStyleConstructor({
                    image
                });
                return style;
            };
            return olPointStyledIconFn;
        }
        else {
            return new this.OlStyleConstructor({
                image: new this.OlStyleIconConstructor({
                    ...baseProps
                })
            });
        }
    }
    /**
     * Get the OL Style object from an GeoStyler-Style LineSymbolizer.
     *
     * @param symbolizer A GeoStyler-Style LineSymbolizer.
     * @return The OL Style object
     */
    getOlLineSymbolizerFromLineSymbolizer(symbolizer, feat) {
        for (const key of Object.keys(symbolizer)) {
            if (isGeoStylerFunction(symbolizer[key])) {
                symbolizer[key] = OlStyleUtil.evaluateFunction(symbolizer[key], feat);
            }
        }
        const color = symbolizer.color;
        const opacity = symbolizer.opacity;
        const sColor = (color && opacity !== null && opacity !== undefined) ?
            OlStyleUtil.getRgbaColor(color, opacity) : color;
        return new this.OlStyleConstructor({
            stroke: new this.OlStyleStrokeConstructor({
                color: sColor,
                width: symbolizer.width,
                lineCap: symbolizer.cap,
                lineJoin: symbolizer.join,
                lineDash: symbolizer.dasharray,
                lineDashOffset: symbolizer.dashOffset
            })
        });
    }
    /**
     * Get the OL Style object from an GeoStyler-Style FillSymbolizer.
     *
     * @param symbolizer A GeoStyler-Style FillSymbolizer.
     * @return The OL Style object
     */
    async getOlPolygonSymbolizerFromFillSymbolizer(symbolizer, feat) {
        for (const key of Object.keys(symbolizer)) {
            if (isGeoStylerFunction(symbolizer[key])) {
                symbolizer[key] = OlStyleUtil.evaluateFunction(symbolizer[key], feat);
            }
        }
        const color = symbolizer.color;
        const opacity = symbolizer.fillOpacity;
        const fColor = color && Number.isFinite(opacity)
            ? OlStyleUtil.getRgbaColor(color, opacity)
            : color;
        let fill = color
            ? new this.OlStyleFillConstructor({ color: fColor })
            : undefined;
        const outlineColor = symbolizer.outlineColor;
        const outlineOpacity = symbolizer.outlineOpacity;
        const oColor = (outlineColor && Number.isFinite(outlineOpacity))
            ? OlStyleUtil.getRgbaColor(outlineColor, outlineOpacity)
            : outlineColor;
        const stroke = outlineColor || symbolizer.outlineWidth ? new this.OlStyleStrokeConstructor({
            color: oColor,
            width: symbolizer.outlineWidth,
            lineDash: symbolizer.outlineDasharray,
        }) : undefined;
        const olStyle = new this.OlStyleConstructor({
            fill,
            stroke
        });
        if (symbolizer.graphicFill) {
            const pattern = this.getOlPatternFromGraphicFill(symbolizer.graphicFill);
            if (!fill) {
                fill = new this.OlStyleFillConstructor({});
            }
            if (pattern) {
                fill.setColor(await pattern);
            }
            olStyle.setFill(fill);
        }
        return olStyle;
    }
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
    async getOlPatternFromGraphicFill(graphicFill) {
        let graphicFillStyle;
        let size = [16, 16];
        const patternImage = new Image();
        if (isIconSymbolizer(graphicFill)) {
            graphicFillStyle = await this.getOlIconSymbolizerFromIconSymbolizer(graphicFill);
            const graphicFillImage = graphicFillStyle?.getImage();
            await graphicFillImage?.load(); // Needed for Icon type images with a remote src
            // We can only work with the image once it's loaded
            if (graphicFillImage?.getImageState() !== OlImageState.LOADED) {
                return null;
            }
            size = graphicFillStyle.getSize();
        }
        else if (isMarkSymbolizer(graphicFill)) {
            graphicFillStyle = await this.getOlPointSymbolizerFromMarkSymbolizer(graphicFill);
            const iconImgSrc = graphicFillStyle.getImage().getSrc();
            const iconSvg = OlStyleUtil.getBase64DecodedSvg(iconImgSrc);
            patternImage.src = iconImgSrc;
            const { dimensions } = getSvgProperties(iconSvg);
            if (dimensions) {
                size = [dimensions, dimensions];
            }
        }
        else {
            return null;
        }
        // eslint-disable-next-line no-console
        console.log('ZZZ - graphicFillStyle', graphicFillStyle);
        // We need to clone the style and image since we'll be changing the scale below (hack)
        const graphicFillStyleCloned = graphicFillStyle.clone();
        const imageCloned = graphicFillStyleCloned.getImage();
        // Temporary canvas.
        // TODO: Can/should we reuse an pre-existing one for efficiency?
        const tmpCanvas = document.createElement('canvas');
        const tmpContext = tmpCanvas.getContext('2d');
        // Hack to make scaling work for Icons.
        // TODO: find a better way than this.
        const scale = imageCloned.getScale() || 1;
        const pixelRatio = scale;
        imageCloned.setScale(1);
        // Create the context where we'll be drawing the style on
        const vectorContext = toContext(tmpContext, {
            pixelRatio,
            size
        });
        imageCloned.onload = () => {
            // Draw the graphic
            // vectorContext.setStyle(graphicFillStyle);
            const pointCoords = size.map(item => item / 2);
            const pointFeature = new OlFeature(new OlGeomPoint(pointCoords));
            // eslint-disable-next-line no-console
            console.log('ZZZ - pointCoords', pointCoords);
            vectorContext.drawFeature(pointFeature, graphicFillStyleCloned);
            // eslint-disable-next-line no-console
            console.log('ZZZ - graphicFillStyle2', graphicFillStyleCloned, vectorContext, scale);
        };
        return new Promise((resolve, reject) => {
            // Create a canvas for the repeating pattern
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            // Ensure the image is loaded before drawing to the canvas
            patternImage.onload = () => {
                // Set canvas size to match SVG dimensions (or your desired size)
                canvas.width = 30;
                canvas.height = 30;
                // Draw the image (SVG) onto the canvas
                context.drawImage(patternImage, 0, 0);
                // Create a repeating pattern from the canvas
                const pattern = context.createPattern(canvas, 'repeat');
                if (!pattern) {
                    reject(new Error('Failed to create pattern'));
                    return;
                }
                // Resolve the pattern so it can be used elsewhere
                resolve(pattern);
            };
            patternImage.onerror = (err) => {
                reject(new Error('Failed to load SVG image: ' + err));
            };
        });
    }
    /**
     * Get the OL StyleFunction object from an GeoStyler-Style TextSymbolizer.
     *
     * @param {TextSymbolizer} textSymbolizer A GeoStyler-Style TextSymbolizer.
     * @return {object} The OL StyleFunction
     */
    getOlTextSymbolizerFromTextSymbolizer(symbolizer, feat) {
        for (const key of Object.keys(symbolizer)) {
            if (isGeoStylerFunction(symbolizer[key])) {
                symbolizer[key] = OlStyleUtil.evaluateFunction(symbolizer[key], feat);
            }
        }
        const color = symbolizer.color;
        let placement = symbolizer.placement;
        if (!placement) {
            // When setting placement it must not be undefined.
            // So we set it to the OL default value.
            placement = 'point';
        }
        if (placement === 'line-center') {
            // line-center not supported by OL.
            // So we use the closest supported value.
            placement = 'line';
        }
        const opacity = symbolizer.opacity;
        const fColor = color && Number.isFinite(opacity)
            ? OlStyleUtil.getRgbaColor(color, opacity)
            : color;
        const haloColor = symbolizer.haloColor;
        const haloWidth = symbolizer.haloWidth;
        const sColor = haloColor && Number.isFinite(opacity)
            ? OlStyleUtil.getRgbaColor(haloColor, opacity)
            : haloColor;
        const baseProps = {
            font: OlStyleUtil.getTextFont(symbolizer),
            fill: new this.OlStyleFillConstructor({
                color: fColor
            }),
            stroke: new this.OlStyleStrokeConstructor({
                color: sColor,
                width: haloWidth ? haloWidth : 0
            }),
            overflow: symbolizer.allowOverlap,
            offsetX: (symbolizer.offset ? symbolizer.offset[0] : 0),
            offsetY: (symbolizer.offset ? symbolizer.offset[1] : 0),
            rotation: typeof (symbolizer.rotate) === 'number' ? symbolizer.rotate * Math.PI / 180 : undefined,
            placement: placement
            // TODO check why props match
            // textAlign: symbolizer.pitchAlignment,
            // textBaseline: symbolizer.anchor
        };
        // check if TextSymbolizer.label contains a placeholder
        const prefix = '\\{\\{';
        const suffix = '\\}\\}';
        const regExp = new RegExp(prefix + '.*?' + suffix, 'g');
        let regExpRes;
        if (!isGeoStylerStringFunction(symbolizer.label)) {
            regExpRes = symbolizer.label ? symbolizer.label.match(regExp) : null;
        }
        if (regExpRes) {
            // if it contains a placeholder
            // return olStyleFunction
            const olPointStyledLabelFn = (feature) => {
                const text = new this.OlStyleTextConstructor({
                    text: OlStyleUtil.resolveAttributeTemplate(feature, symbolizer.label, ''),
                    ...baseProps
                });
                const style = new this.OlStyleConstructor({
                    text: text
                });
                return style;
            };
            return olPointStyledLabelFn;
        }
        else {
            // if TextSymbolizer does not contain a placeholder
            // return OlStyle
            return new this.OlStyleConstructor({
                text: new this.OlStyleTextConstructor({
                    text: symbolizer.label,
                    ...baseProps
                })
            });
        }
    }
}
export default OlStyleParser;
//# sourceMappingURL=OlStyleParser.js.map