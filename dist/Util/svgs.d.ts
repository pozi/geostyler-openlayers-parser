/**
 * Returns a string containing an SVG of the given shape.
 *
 * @param {import("geostyler-style").WellKnownName} [shape='circle'] - The shape to generate. Can be one of:
 *   arrow, arrowhead, asterisk_fill, circle, cross, cross2, cross_fill, decagon,
 *   diagonal_half_square, diamond, equilateral_triangle, filled_arrowhead,
 *   half_arc, half_square, heart, hexagon, left_half_triangle, line, octagon,
 *   parallelogram_left, parallelogram_right, pentagon, quarter_arc,
 *   quarter_circle, quarter_square, right_half_triangle, rounded_square,
 *   semi_circle, shield, square, square_with_corners, star, star_diamond,
 *   third_arc, third_circle, trapezoid, triangle
 * @param {Object} [options={}] - Options to customize the SVG.
 * @param {string} [options.fill='#fff'] - Fill color.
 * @param {string} [options.stroke='#000'] - Stroke color.
 * @param {number} [options.strokeWidth=1] - Stroke width.
 * @param {number} [options.dimension=40] - Width and height of the SVG.
 * @returns {string} An SVG string.
 */
export declare function getShapeSvg(shape?: string, { fill, stroke, strokeWidth, dimensions }?: {
    fill?: string | undefined;
    stroke?: string | undefined;
    strokeWidth?: string | undefined;
    dimensions?: string | undefined;
}): string;
