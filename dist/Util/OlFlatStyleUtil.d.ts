import { FlatStyle, FlatStyleLike, Rule as FlatRule, ColorExpression } from 'ol/style/flat';
import { Filter, PropertyType, Expression as StyleExpression } from 'geostyler-style';
export type Expression = any[];
declare const comparisonFilterNames: string[];
declare const filterNames: string[];
export type FilterExpression = [typeof filterNames[number], ...any[]];
export type ComparisonFilterExpression = [typeof comparisonFilterNames[number], ...any[]];
declare class OlFlatStyleUtil {
    static isFlatRule(flatStyle: FlatStyle | FlatRule): flatStyle is FlatRule;
    static isFlatRuleArray(flatStyleLike: FlatStyleLike): flatStyleLike is FlatRule[];
    static isFlatStyle(flatStyleLike: FlatStyleLike): flatStyleLike is FlatStyle;
    static isFlatStyleArray(flatStyleLike: FlatStyleLike): flatStyleLike is FlatStyle[];
    static isExpression(flatStyleProp: any): flatStyleProp is Expression;
    static isFilter(flatStyleProp: any): flatStyleProp is FilterExpression;
    static isComparisonFilter(filter: FilterExpression): filter is ComparisonFilterExpression;
    static getColorAndOpacity(flatStyleProp: ColorExpression | undefined): [string | StyleExpression<string> | undefined, number | undefined];
    static hasFlatFill(flatStyle: FlatStyle): boolean;
    static hasFlatStroke(flatStyle: FlatStyle): boolean;
    static hasFlatText(flatStyle: FlatStyle): boolean;
    static hasFlatIcon(flatStyle: FlatStyle): boolean;
    static hasFlatCircle(flatStyle: FlatStyle): boolean;
    static olExpressionToGsExpression<T extends PropertyType>(olExpression: any): StyleExpression<T>;
    static olFilterToGsFilter(olFilter: any): Filter | undefined;
}
export default OlFlatStyleUtil;
