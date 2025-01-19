export interface SvgOptions {
    id?: string;
    dimensions: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
}
/**
 * Returns an SVG string for a given shape type with the specified options.
 *
 * @param {string} [shape='circle'] The shape type. Supported values are:
 *     'arrow', 'arrowhead', 'asterisk_fill', 'circle', 'cross', 'cross2', 'cross_fill',
 *     'decagon', 'diamond', 'diagonal_half_square', 'equilateral_triangle', 'filled_arrowhead',
 *     'half_arc', 'half_square', 'heart', 'hexagon', 'left_half_triangle', 'line',
 *     'octagon', 'parallelogram_left', 'parallelogram_right', 'pentagon', 'quarter_arc',
 *     'quarter_circle', 'quarter_square', 'right_half_triangle', 'rounded_square',
 *     'semi_circle', 'shield', 'square', 'square_with_corners', 'star', 'star_diamond',
 *     'third_arc', 'third_circle', 'trapezoid', 'triangle'
 * @param {SvgOptions} [options={}] The options to use for the shape.
 *     The following options are supported:
 *     - fill: The color to use for filling the shape. Default is '#fff'.
 *     - stroke: The color to use for the shape's stroke. Default is '#000'.
 *     - strokeWidth: The width of the shape's stroke. Default is '1'.
 *     - dimensions: The width and height of the resulting SVG. Default is '40'.
 * @returns {string} An SVG string for the given shape type with the specified options.
 */
export declare const getShapeSvg: (shape?: string, { fill, stroke, strokeWidth, dimensions }?: {
    fill?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: string | undefined;
    dimensions?: number | undefined;
}) => string;
/**
 * Extracts the properties of an SVG string into an object.
 *
 * @param svgString the SVG string to parse
 * @returns an object containing the SVG properties
 */
export declare const getSvgProperties: (svgString: string) => SvgOptions;
