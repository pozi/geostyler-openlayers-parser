import { isGeoStylerBooleanFunction, isGeoStylerFunction, isGeoStylerNumberFunction, isGeoStylerStringFunction, isGeoStylerUnknownFunction } from 'geostyler-style/dist/typeguards';
import { colors } from './colors';
import { Buffer } from 'buffer';
const WELLKNOWNNAME_TTF_REGEXP = /^ttf:\/\/(.+)#(.+)$/;
export const DUMMY_MARK_SYMBOLIZER_FONT = 'geostyler-mark-symbolizer';
/**
 * Offers some utility functions to work with OpenLayers Styles.
 */
class OlStyleUtil {
    /**
     * Transforms a HEX encoded color and an opacity value to a RGB(A) notation.
     *
     * @param colorString HEX encoded color
     * @param opacity  Opacity (Betweeen 0 and 1)
     * @return the RGB(A) value of the input color
     */
    static getRgbaColor(colorString, opacity) {
        if (isGeoStylerStringFunction(colorString)) {
            colorString = OlStyleUtil.evaluateStringFunction(colorString);
        }
        if (typeof (colorString) !== 'string') {
            return;
        }
        if (colorString.startsWith('rgba(')) {
            return colorString;
        }
        // check if is valid HEX color - see also here
        // https://stackoverflow.com/questions/8027423/how-to-check-if-a-string-is-a-valid-hex-color-representation/8027444
        const isHexColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorString);
        if (!isHexColor) {
            return;
        }
        const r = parseInt(colorString.slice(1, 3), 16);
        const g = parseInt(colorString.slice(3, 5), 16);
        const b = parseInt(colorString.slice(5, 7), 16);
        if (isGeoStylerNumberFunction(opacity)) {
            opacity = OlStyleUtil.evaluateNumberFunction(opacity);
        }
        if (opacity < 0) {
            opacity = 1;
        }
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }
    /**
     * Splits a RGBA encoded color into its color values.
     *
     * @param {string} rgbaColor RGB(A) encoded color
     * @return {number[]} Numeric color values as array
     */
    static splitRgbaColor(rgbaColor) {
        const colorsOnly = rgbaColor.substring(rgbaColor.indexOf('(') + 1, rgbaColor.lastIndexOf(')')).split(/,\s*/);
        const red = parseInt(colorsOnly[0], 10);
        const green = parseInt(colorsOnly[1], 10);
        const blue = parseInt(colorsOnly[2], 10);
        const opacity = parseFloat(colorsOnly[3]);
        return [red, green, blue, opacity];
    }
    /**
     * Transforms a RGB(A) or named color value to a HEX encoded notation.
     * If a HEX color is provided it will be returned untransformed.
     *
     * @param {string} inColor The color to transform
     * @return {string | undefined} The HEX color representation of the given color
     */
    static getHexColor(inColor) {
        // if passing in a hex code we just return it
        if (inColor.startsWith('#')) {
            return inColor;
        }
        else if (inColor.startsWith('rgb')) {
            const colorArr = OlStyleUtil.splitRgbaColor(inColor);
            return OlStyleUtil.getHexCodeFromRgbArray(colorArr);
        }
        else if (colors[inColor.toLocaleLowerCase()] !== undefined) {
            const rgbColorArr = colors[inColor.toLocaleLowerCase()];
            return OlStyleUtil.getHexCodeFromRgbArray(rgbColorArr);
        }
        else {
            return;
        }
    }
    /**
     * Returns the hex code for a given RGB(A) array.
     *
     * @param colorArr RGB(A) array. e.g. [255,0,0]
     * @return {string} The HEX color representation of the given color
     */
    static getHexCodeFromRgbArray(colorArr) {
        return '#' + colorArr.map((x, idx) => {
            const hex = x.toString(16);
            // skip opacity if passed as fourth entry
            if (idx < 3) {
                return hex.length === 1 ? '0' + hex : hex;
            }
            return '';
        }).join('');
    }
    /**
     * Returns the opacity value of a RGB(A) color value.
     *
     * @param rgbaColor RGBA encoded color
     * @return {string | undefined} The opacity value of the given RGBA color
     */
    static getOpacity(rgbaColor) {
        if (!rgbaColor.startsWith('rgba(')) {
            return;
        }
        const colorArr = OlStyleUtil.splitRgbaColor(rgbaColor);
        if (colorArr.length === 4) {
            return colorArr[3];
        }
        else {
            return;
        }
    }
    /**
     * Returns an OL compliant font string.
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getTextFont(symbolizer) {
        const fontWeight = symbolizer.fontWeight ?? 'normal';
        const fontStyle = symbolizer.fontStyle ?? 'normal';
        const size = symbolizer.size;
        const font = symbolizer.font;
        return fontWeight + ' ' + fontStyle + ' ' + size + 'px ' + font?.join(', ');
    }
    /**
     * Returns true if the given mark symbolizer is based on a font glyph
     * (i.e. has a well known name property starting with 'ttf://').
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getIsFontGlyphBased(symbolizer) {
        return WELLKNOWNNAME_TTF_REGEXP.test(symbolizer.wellKnownName);
    }
    /**
     * Returns whether the given font (as used in the OpenLayers Text Style `font` property)
     * is intended for a mark symbolizer or not.
     * This is done by checking whether the dummy DUMMY_MARK_SYMBOLIZER_FONT font name is present.
     *
     * @param font The text font to analyze
     */
    static getIsMarkSymbolizerFont(font) {
        if (!font) {
            return false;
        }
        const search = DUMMY_MARK_SYMBOLIZER_FONT;
        return font.substring(font.length - search.length, font.length) === search;
    }
    /**
     * Returns an OL compliant font string, to be used for mark symbolizers
     * using a font glyph.
     * This also includes a dummy DUMMY_MARK_SYMBOLIZER_FONT font name at the end of the
     * string to allow determining that this font was intended for a mark symbolizer
     * later on.
     *
     * @param symbolizer The TextSymbolizer to derive the font string from
     */
    static getTextFontForMarkSymbolizer(symbolizer) {
        const parts = symbolizer.wellKnownName.match(WELLKNOWNNAME_TTF_REGEXP);
        if (!parts) {
            throw new Error(`Could not parse font-based well known name: ${symbolizer.wellKnownName}`);
        }
        const fontFamily = parts[1];
        return `Normal ${symbolizer.radius || 5}px '${fontFamily}', ${DUMMY_MARK_SYMBOLIZER_FONT}`;
    }
    /**
     * Returns a 1-char string to be used as text for mark symbolizers using a font glyph.
     *
     * @param symbolizer The MarkSymbolizer to derive the character string from
     */
    static getCharacterForMarkSymbolizer(symbolizer) {
        const parts = symbolizer.wellKnownName.match(WELLKNOWNNAME_TTF_REGEXP);
        if (!parts) {
            throw new Error(`Could not parse font-based well known name: ${symbolizer.wellKnownName}`);
        }
        return String.fromCharCode(parseInt(parts[2], 16));
    }
    /**
     * Returns the font name used in the OpenLayers text style `font` property.
     *
     * @param olFont the `font` property of an OpenLayers text style
     */
    static getFontNameFromOlFont(olFont) {
        const parts = olFont.match(/(?:\d+\S+) '?"?([^,'"]+)/);
        if (!parts) {
            throw new Error(`Could not find font family name in the following string: ${olFont}`);
        }
        return parts[1];
    }
    /**
     * Returns the size in pixels specified in the OpenLayers text style `font` property,
     * or 0 if not found.
     *
     * @param olFont the `font` property of an OpenLayers text style
     */
    static getSizeFromOlFont(olFont) {
        const parts = olFont.match(/(?:(\d+)px)/);
        return parts ? parseInt(parts[1], 10) : 0;
    }
    /**
     * Encodes the given SVG string using base64 encoding.
     *
     * @param svgString the SVG string to encode
     * @returns the base64 encoded SVG string
     */
    static getBase64EncodedSvg(svgString) {
        return 'data:image/svg+xml;base64,' + Buffer.from(svgString).toString('base64');
    }
    /**
     * Decodes a base64 encoded SVG string.
     *
     * @param svgBase64String The base64 encoded SVG string to decode.
     * @returns The decoded SVG string in UTF-8 format.
     */
    static getBase64DecodedSvg(svgBase64String) {
        return Buffer.from(svgBase64String.replace('data:image/svg+xml;base64,', ''), 'base64').toString('utf-8');
    }
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
    static resolveAttributeTemplate(feature, template, noValueFoundText = 'n.v.', valueAdjust = (key, val) => val) {
        let attributeTemplatePrefix = '\\{\\{';
        let attributeTemplateSuffix = '\\}\\}';
        // Find any character between two braces (including the braces in the result)
        let regExp = new RegExp(attributeTemplatePrefix + '(.*?)' + attributeTemplateSuffix, 'g');
        let regExpRes = template.match(regExp);
        // If we have a regex result, it means we found a placeholder in the
        // template and have to replace the placeholder with its appropriate value.
        if (regExpRes) {
            // Iterate over all regex match results and find the proper attribute
            // for the given placeholder, finally set the desired value to the hover.
            // field text
            regExpRes.forEach(res => {
                // We count every non matching candidate. If this count is equal to
                // the objects length, we assume that there is no match at all and
                // set the output value to the value of "noValueFoundText".
                let noMatchCnt = 0;
                for (let [key, value] of Object.entries(feature.getProperties())) {
                    // Remove the suffixes and find the matching attribute column.
                    let attributeName = res.slice(2, res.length - 2);
                    if (attributeName.toLowerCase() === key.toLowerCase()) {
                        template = template.replace(res, valueAdjust(key, value));
                        break;
                    }
                    else {
                        noMatchCnt++;
                    }
                }
                // No key match found for this feature (e.g. if key not
                // present or value is null).
                if (noMatchCnt === Object.keys(feature.getProperties()).length) {
                    template = template.replace(res, noValueFoundText);
                }
            });
        }
        return template;
    }
    static evaluateFunction(func, feature) {
        if (func.name === 'property') {
            if (!feature) {
                throw new Error(`Could not evalute 'property' function. Feature ${feature} is not defined.`);
            }
            if (isGeoStylerStringFunction(func.args[0])) {
                return feature?.get(OlStyleUtil.evaluateStringFunction(func.args[0], feature));
            }
            else {
                return feature?.get(func.args[0]);
            }
        }
        if (isGeoStylerUnknownFunction(func)) {
            return OlStyleUtil.evaluateUnknownFunction(func, feature);
        }
        if (isGeoStylerStringFunction(func)) {
            return OlStyleUtil.evaluateStringFunction(func, feature);
        }
        if (isGeoStylerNumberFunction(func)) {
            return OlStyleUtil.evaluateNumberFunction(func, feature);
        }
        if (isGeoStylerBooleanFunction(func)) {
            return OlStyleUtil.evaluateBooleanFunction(func, feature);
        }
        return;
    }
    static evaluateBooleanFunction(func, feature) {
        const args = func.args.map(arg => {
            if (isGeoStylerFunction(arg)) {
                return OlStyleUtil.evaluateFunction(arg, feature);
            }
            return arg;
        });
        switch (func.name) {
            case 'all':
                return args.map(arg => this.evaluateBooleanFunction(arg, feature))
                    .every(result => result === true);
            case 'any':
                return args.map(arg => this.evaluateBooleanFunction(arg, feature))
                    .some(result => result === true);
            case 'between':
                return args[0] >= args[1] && args[0] <= args[2];
            case 'double2bool':
                // TODO: evaluate this correctly
                return false;
            case 'equalTo':
                return args[0] === args[1];
            case 'greaterThan':
                return args[0] > args[1];
            case 'greaterThanOrEqualTo':
                return args[0] >= args[1];
            case 'in':
                return args.slice(1).includes(args[0]);
            case 'lessThan':
                return args[0] < args[1];
            case 'lessThanOrEqualTo':
                return args[0] <= args[1];
            case 'not':
                return !args[0];
            case 'notEqualTo':
                return args[0] !== args[1];
            case 'parseBoolean':
                return !!args[0];
            case 'strEndsWith':
                return args[0].endsWith(args[1]);
            case 'strEqualsIgnoreCase':
                return args[0].toLowerCase() === args[1].toLowerCase();
            case 'strMatches':
                const regEx = args[1];
                const regexArray = regEx.match(/\/(.*?)\/([gimy]{0,4})$/);
                if (regexArray && regexArray.length === 3) {
                    return new RegExp(regexArray[1], regexArray[2]).test(args[0]);
                }
                else {
                    return false;
                }
            case 'strStartsWith':
                return args[0].startsWith(args[1]);
            default:
                return false;
        }
    }
    static evaluateNumberFunction(func, feature) {
        if (func.name === 'pi') {
            return Math.PI;
        }
        if (func.name === 'random') {
            return Math.random();
        }
        const args = func.args.map(arg => {
            if (isGeoStylerFunction(arg)) {
                return OlStyleUtil.evaluateFunction(arg, feature);
            }
            return arg;
        });
        switch (func.name) {
            case 'abs':
                return Math.abs(args[0]);
            case 'acos':
                return Math.acos(args[0]);
            case 'add':
                return args[0] + args[1];
            case 'asin':
                return Math.asin(args[0]);
            case 'atan':
                return Math.atan(args[0]);
            case 'atan2':
                // TODO: evaluate this correctly
                return args[0];
            case 'ceil':
                return Math.ceil(args[0]);
            case 'cos':
                return Math.cos(args[0]);
            case 'div':
                return args[0] / args[1];
            case 'exp':
                return Math.exp(args[0]);
            case 'floor':
                return Math.floor(args[0]);
            case 'log':
                return Math.log(args[0]);
            case 'max':
                return Math.max(...args);
            case 'min':
                return Math.min(...args);
            case 'modulo':
                return args[0] % args[1];
            case 'mul':
                return args[0] * args[1];
            case 'pow':
                return Math.pow(args[0], args[1]);
            case 'rint':
                // TODO: evaluate this correctly
                return args[0];
            case 'round':
                return Math.round(args[0]);
            case 'sin':
                return Math.sin(args[0]);
            case 'sqrt':
                return Math.sqrt(args[0]);
            case 'strIndexOf':
                return args[0].indexOf(args[1]);
            case 'strLastIndexOf':
                return args[0].lastIndexOf(args[1]);
            case 'strLength':
                return args[0].length;
            case 'sub':
                return args[0] - args[1];
            case 'tan':
                return Math.tan(args[0]);
            case 'toDegrees':
                return args[0] * (180 / Math.PI);
            case 'toRadians':
                return args[0] * (Math.PI / 180);
            default:
                return args[0];
        }
    }
    static evaluateUnknownFunction(func, feature) {
        const args = func.args.map(arg => {
            if (isGeoStylerFunction(arg)) {
                return OlStyleUtil.evaluateFunction(arg, feature);
            }
            return arg;
        });
        switch (func.name) {
            case 'property':
                return feature?.get(args[0]);
            case 'case':
                const caseArgs = args;
                let match;
                for (let index = 0; index < caseArgs.length; index++) {
                    const caseArg = caseArgs[index];
                    // last arg of the case-function-expression is the default value
                    if (index === caseArgs.length - 1) {
                        match = caseArg;
                        break;
                        // the case can be a boolean
                    }
                    else if (caseArg.case === true) {
                        match = caseArg.value;
                        break;
                        // … or a boolean function that has to be evaluated first
                    }
                    else if (OlStyleUtil.evaluateBooleanFunction(caseArg.case, feature)) {
                        match = caseArg.value;
                        break;
                    }
                }
                return match;
            default:
                return args[0];
        }
    }
    static evaluateStringFunction(func, feature) {
        const args = func.args.map(arg => {
            if (isGeoStylerFunction(arg)) {
                return OlStyleUtil.evaluateFunction(arg, feature);
            }
            return arg;
        });
        switch (func.name) {
            case 'numberFormat':
                // TODO: evaluate this correctly
                return args[0];
            case 'strAbbreviate':
                // TODO: evaluate this correctly
                return args[0];
            case 'strCapitalize':
                // https://stackoverflow.com/a/32589289/10342669
                var splitStr = args[0].toLowerCase().split(' ');
                for (let part of splitStr) {
                    part = part.charAt(0).toUpperCase() + part.substring(1);
                }
                return splitStr.join(' ');
            case 'strConcat':
                return args.join();
            case 'strDefaultIfBlank':
                return args[0]?.length < 1 ? args[1] : args[0];
            case 'strReplace':
                if (args[3] === true) {
                    return args[0].replaceAll(args[1], args[2]);
                }
                else {
                    return args[0].replace(args[1], args[2]);
                }
            case 'strStripAccents':
                // https://stackoverflow.com/a/37511463/10342669
                return args[0].normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
            case 'strSubstring':
                return args[0].substring(args[1], args[2]);
            case 'strSubstringStart':
                return args[0].substring(args[1]);
            case 'strToLowerCase':
                return args[0].toLowerCase();
            case 'strToUpperCase':
                return args[0].toUpperCase();
            case 'strTrim':
                return args[0].trim();
            default:
                return args[0];
        }
    }
    static containsGeoStylerFunctions(style) {
        return style.rules.some(rule => {
            const filterHasFunction = Array.isArray(rule.filter) && rule.filter?.some(isGeoStylerFunction);
            const styleHasFunction = rule.symbolizers?.some(symbolizer => {
                return Object.values(symbolizer).some(isGeoStylerFunction);
            });
            const scaleDenominatorHasFunction = isGeoStylerFunction(rule?.scaleDenominator?.max)
                || isGeoStylerFunction(rule?.scaleDenominator?.min);
            return filterHasFunction || styleHasFunction || scaleDenominatorHasFunction;
        });
    }
}
export default OlStyleUtil;
//# sourceMappingURL=OlStyleUtil.js.map