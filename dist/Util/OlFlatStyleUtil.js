import { invert } from 'lodash';
import OlStyleUtil from './OlStyleUtil';
const comparisonFilterNames = [
    '==',
    '!=',
    '<',
    '<=',
    '>',
    '>=',
    'between',
];
const filterNames = [
    ...comparisonFilterNames,
    'all',
    'any',
    '!'
];
// TODO continue here
const filterNameMap = {
    '==': '==',
    '*=': null,
    '!=': '!=',
    '<': '<',
    '<=': '<=',
    '>': '>',
    '>=': '>=',
    '<=x<=': 'between',
    '&&': 'all',
    '||': 'any',
    '!': '!',
};
const invertedFilterMap = invert(filterNameMap);
const expressionNames = [
    'get',
    '*',
    '/',
    '+',
    '-',
    '%',
    '^',
    'abs',
    'floor',
    'round',
    'ceil',
    'sin',
    'cos',
    'atan',
    'sqrt',
    'case',
    'interpolate',
    'string',
    '<',
    '<=',
    '>',
    '>=',
    '==',
    '!=',
    '!',
    'all',
    'any',
    'between',
    'in',
    'to-string',
];
const functionNameMap = {
    // ---- string ----
    numberFormat: null,
    // numberFormat: 'number-format', // TODO: this could be done in theory but gs and mb use different format approaches
    strAbbreviate: null,
    strCapitalize: null,
    strConcat: null,
    strDefaultIfBlank: 'string',
    strEndsWith: null,
    strEqualsIgnoreCase: null,
    strIndexOf: null,
    strLastIndexOf: null,
    strLength: null,
    strMatches: null,
    strReplace: null,
    strStartsWith: null,
    strStripAccents: null,
    strSubstring: null,
    strSubstringStart: null,
    strToLowerCase: null,
    strToUpperCase: null,
    strToString: 'to-string',
    strTrim: null,
    // ---- number ----
    add: '+',
    abs: 'abs',
    acos: null,
    asin: null,
    // openlayers uses atan if only one argument is passed
    // atan2 is used for two arguments
    atan: 'atan',
    atan2: 'atan',
    ceil: 'ceil',
    cos: 'cos',
    div: '/',
    exp: null,
    floor: 'floor',
    interpolate: 'interpolate',
    log: null,
    // – : 'ln2'
    // – : 'log10'
    // – : 'log2'
    max: null,
    min: null,
    modulo: '%',
    mul: '*',
    pi: null,
    // - : 'e',
    pow: '^',
    random: null,
    rint: null,
    round: 'round',
    sin: 'sin',
    sqrt: 'sqrt',
    sub: '-',
    tan: null,
    toDegrees: null,
    toNumber: null,
    toRadians: null,
    // ---- boolean ----
    all: 'all',
    // eslint-disable-next-line id-blacklist
    any: 'any',
    between: 'between',
    double2bool: null,
    equalTo: '==',
    greaterThan: '>',
    greaterThanOrEqualTo: '>=',
    in: 'in',
    lessThan: '<',
    lessThanOrEqualTo: '<=',
    not: '!',
    notEqualTo: '!=',
    parseBoolean: null,
    // ---- unknown ----
    case: 'case',
    property: 'get',
    step: null
};
const invertedFunctionNameMap = invert(functionNameMap);
class OlFlatStyleUtil {
    static isFlatRule(flatStyle) {
        return 'style' in flatStyle;
    }
    static isFlatRuleArray(flatStyleLike) {
        const isArray = Array.isArray(flatStyleLike);
        if (!isArray) {
            return false;
        }
        const hasFlatRules = flatStyleLike.every(style => OlFlatStyleUtil.isFlatRule(style));
        return hasFlatRules;
    }
    static isFlatStyle(flatStyleLike) {
        const isArray = Array.isArray(flatStyleLike);
        if (isArray) {
            return false;
        }
        return !('style' in flatStyleLike);
    }
    static isFlatStyleArray(flatStyleLike) {
        const isArray = Array.isArray(flatStyleLike);
        if (!isArray) {
            return false;
        }
        const isFlatRuleArray = OlFlatStyleUtil.isFlatRuleArray(flatStyleLike);
        if (isFlatRuleArray) {
            return false;
        }
        const hasFlatStyles = flatStyleLike.every(style => OlFlatStyleUtil.isFlatStyle(style));
        return hasFlatStyles;
    }
    static isExpression(flatStyleProp) {
        const isUndefined = flatStyleProp === undefined;
        const isArray = Array.isArray(flatStyleProp);
        if (isUndefined || !isArray) {
            return false;
        }
        const hasOperator = typeof flatStyleProp[0] == 'string';
        const isExpressionName = expressionNames.includes(flatStyleProp[0]);
        return hasOperator && isExpressionName;
    }
    static isFilter(flatStyleProp) {
        const isUndefined = flatStyleProp === undefined;
        const isArray = Array.isArray(flatStyleProp);
        if (isUndefined || !isArray) {
            return false;
        }
        const hasOperator = typeof flatStyleProp[0] == 'string';
        const isFilterName = filterNames.includes(flatStyleProp[0]);
        return hasOperator && isFilterName;
    }
    static isComparisonFilter(filter) {
        const isUndefined = filter === undefined;
        const isArray = Array.isArray(filter);
        if (isUndefined || !isArray) {
            return false;
        }
        const hasOperator = typeof filter[0] == 'string';
        const isComparisonFilterName = comparisonFilterNames.includes(filter[0]);
        return hasOperator && isComparisonFilterName;
    }
    static getColorAndOpacity(flatStyleProp) {
        if (flatStyleProp === undefined) {
            return [undefined, undefined];
        }
        const isArray = Array.isArray(flatStyleProp);
        if (!isArray) {
            let hexColor = OlStyleUtil.getHexColor(flatStyleProp);
            if (!hexColor) {
                throw new Error('Invalid color value');
            }
            const hasAlpha = hexColor.length > 7;
            if (hasAlpha) {
                hexColor = hexColor.slice(0, 7);
            }
            const opacity = OlStyleUtil.getOpacity(flatStyleProp);
            return [hexColor, opacity];
        }
        return [
            OlStyleUtil.getHexCodeFromRgbArray(flatStyleProp),
            flatStyleProp[3]
        ];
    }
    static hasFlatFill(flatStyle) {
        const hasFill = ('fill-color' in flatStyle) && flatStyle['fill-color'] !== undefined;
        return hasFill;
    }
    static hasFlatStroke(flatStyle) {
        const hasStrokeColor = ('stroke-color' in flatStyle) && flatStyle['stroke-color'] !== undefined;
        const hasStrokeWidth = ('stroke-width' in flatStyle) && flatStyle['stroke-width'] !== undefined;
        return hasStrokeColor || hasStrokeWidth;
    }
    static hasFlatText(flatStyle) {
        const hasTextValue = ('text-value' in flatStyle) && flatStyle['text-value'] !== undefined;
        return hasTextValue;
    }
    static hasFlatIcon(flatStyle) {
        const hasIconSrc = ('icon-src' in flatStyle) && flatStyle['icon-src'] !== undefined;
        return hasIconSrc;
    }
    static hasFlatCircle(flatStyle) {
        const hasCircleRadius = ('circle-radius' in flatStyle) && flatStyle['circle-radius'] !== undefined;
        return hasCircleRadius;
    }
    static olExpressionToGsExpression(olExpression) {
        if (!OlFlatStyleUtil.isExpression(olExpression)) {
            return olExpression;
        }
        const olExpressionName = olExpression[0];
        const functionName = invertedFunctionNameMap[olExpressionName];
        let func;
        const args = olExpression.slice(1);
        switch (functionName) {
            case 'case': {
                const gsArgs = [];
                const fallback = OlFlatStyleUtil.olExpressionToGsExpression(args.pop());
                args.forEach((a, index) => {
                    const gsIndex = Math.floor(index / 2);
                    if (index % 2 === 0) {
                        gsArgs[gsIndex] = {
                            case: OlFlatStyleUtil.olExpressionToGsExpression(a)
                        };
                    }
                    else {
                        gsArgs[gsIndex] = {
                            ...gsArgs[gsIndex],
                            value: OlFlatStyleUtil.olExpressionToGsExpression(a)
                        };
                    }
                });
                func = {
                    name: functionName,
                    args: [fallback, ...gsArgs]
                };
                break;
            }
            case 'interpolate': {
                // currently only supporting linear interpolation
                const interpolationType = args.shift()[0];
                const input = OlFlatStyleUtil.olExpressionToGsExpression(args.shift());
                const gsArgs = [];
                args.forEach((a, index) => {
                    const gsIndex = Math.floor(index / 2);
                    if (index % 2 === 0) {
                        gsArgs[gsIndex] = {
                            stop: OlFlatStyleUtil.olExpressionToGsExpression(a)
                        };
                    }
                    else {
                        gsArgs[gsIndex] = {
                            ...gsArgs[gsIndex],
                            value: OlFlatStyleUtil.olExpressionToGsExpression(a)
                        };
                    }
                });
                // adding the interpolation type and the input as the first args
                gsArgs.unshift({ name: interpolationType }, input);
                func = {
                    name: functionName,
                    args: gsArgs
                };
                break;
            }
            case 'strDefaultIfBlank': {
                func = {
                    name: functionName,
                    // gs function only allows two args
                    args: args
                        .slice(0, 2)
                        .map(OlFlatStyleUtil.olExpressionToGsExpression)
                };
                break;
            }
            case 'in': {
                const needle = OlFlatStyleUtil.olExpressionToGsExpression(args.shift());
                let haystack = [];
                if (args[0] === 'literal') {
                    haystack = args[0].pop();
                }
                else {
                    haystack = args[0];
                }
                func = {
                    name: functionName,
                    args: [needle, ...haystack]
                };
                break;
            }
            case 'atan':
            case 'atan2': {
                const atanFunc = {
                    name: args.length === 1 ? 'atan' : 'atan2',
                    args: args.map(OlFlatStyleUtil.olExpressionToGsExpression)
                };
                if (args.length === 1) {
                    func = atanFunc;
                }
                else {
                    func = atanFunc;
                }
                break;
            }
            default:
                func = {
                    name: functionName,
                    args: args.map(OlFlatStyleUtil.olExpressionToGsExpression)
                };
                break;
        }
        return func;
    }
    static olFilterToGsFilter(olFilter) {
        const isExpression = OlFlatStyleUtil.isExpression(olFilter);
        const isFilter = OlFlatStyleUtil.isFilter(olFilter);
        const isComparisonFilter = OlFlatStyleUtil.isComparisonFilter(olFilter);
        if (!isFilter && !isExpression) {
            return olFilter;
        }
        let filter;
        if (isFilter) {
            const olExpressionName = olFilter[0];
            const filterName = invertedFilterMap[olExpressionName];
            const args = olFilter.slice(1);
            let propertyName = args.shift();
            // In GeoStyler, the first argument of a comparison filter
            // is the property name as plain string. So if the first argument
            // is a 'get' expression, we extract the property name from it.
            if (isComparisonFilter && Array.isArray(propertyName) && propertyName[0] === 'get') {
                propertyName = propertyName[1];
            }
            filter = [
                filterName,
                OlFlatStyleUtil.olFilterToGsFilter(propertyName),
                ...args.map(OlFlatStyleUtil.olFilterToGsFilter)
            ];
        }
        else {
            filter = OlFlatStyleUtil.olExpressionToGsExpression(olFilter);
        }
        return filter;
    }
}
export default OlFlatStyleUtil;
//# sourceMappingURL=OlFlatStyleUtil.js.map