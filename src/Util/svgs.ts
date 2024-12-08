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
export function getShapeSvg(
  shape = 'circle',
  { fill = '#fff', stroke = '#000', strokeWidth = '1', dimensions = '40' } = {}
) {
  const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions}" height="${dimensions}" viewBox="-12 -12 24 24">`;
  const svgFooter = '</svg>';

  let svgBody: string;
  switch (shape) {
    case 'arrow':
      svgBody =
        '<path id="arrow" d="M 0,-10 L 5,-5 L 2.5,-5 L 2.5,10 L -2.5,10 L -2.5,-5 L -5,-5 L 0,-10 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'arrowhead':
      svgBody =
        '<path id="arrowhead" d="M -10 -10 L 0 0 L -10 10"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'asterisk_fill':
      svgBody =
        '<path id="asterisk_fill" d="M -1.5,-10 L 1.5,-10L 1.5,-3.939 L 6.011,-8.132 L 8.132,-6.011 L 3.939,-1.5 L 10,-1.5 L 10,1.5 L 3.939,1.5 L 8.132,6.011 L 6.011,8.132 L 1.5,3.939 L 1.5,10 L -1.5,10 L -1.5,3.939 L -6.011,8.132 L -8.132,6.011 L -3.939,1.5 L -10,1.5 L -10,-1.5 L -3.939,-1.5 L -8.132,-6.011 L -6.011,-8.132 L -1.5,-3.939 L -1.5,-10 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'circle':
      svgBody = '<circle id="circle" cx="0" cy="0" r="10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'cross':
      svgBody =
        '<path id="cross" d="M -10 0 L 10 0 M 0 -10 L 0 10"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'cross2':
      svgBody =
        '<path id="cross2" d="M -10 -10 L 10 10 M 10 -10 L -10 10"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'cross_fill':
      svgBody =
        '<path id="cross_fill" d="M -10,-2 L -10,-2 L -10,2 L -2,2 L -2,10 L 2,10 L 2,2 L 10,2 L 10,-2 L 2,-2 L 2,-10 L -2,-10 L -2,-2 L -10,-2 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'decagon':
      svgBody =
        '<polygon id="decagon" points="5.878,8.09 9.511,3.09 9.511,-3.09 5.878,-8.09 0,-10 -5.878,-8.09 -9.511,-3.09 -9.511,3.09 -5.878,8.09 0,10 5.878,8.09" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'diagonal_half_square':
      svgBody =
        '<polygon id="diagonal_half_square" points="-10,-10 10,10 -10,10 -10,-10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'diamond':
      svgBody =
        '<polygon id="diamond" points="-10,0 0,10 10,0 0,-10 -10,0" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'equilateral_triangle':
      svgBody =
        '<polygon id="equilateral_triangle" points="-8.66,5 8.66,5 0,-10 -8.66,5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'filled_arrowhead':
      svgBody =
        '<path id="filled_arrowhead" d="M 0,0 L -10,10 L -10,-10 L 0,0 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'half_arc':
      svgBody =
        '<path id="half_arc" d="M -10 0 A -10 -10 0 0 1 10 0"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'half_square':
      svgBody =
        '<polygon id="half_square" points="-10,-10 0,-10 0,10 -10,10 -10,-10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'heart':
      svgBody =
        '<path id="heart" d="M -9.5 -2 A 1 1 0 0 1 0 -7.5 A 1 1 0 0 1 9.5 -2 L 0 10 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'hexagon':
      svgBody =
        '<polygon id="hexagon" points="-8.66,-5 -8.66,5 0,10 8.66,5 8.66,-5 0,-10 -8.66,-5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'left_half_triangle':
      svgBody =
        '<polygon id="left_half_triangle" points="0,10 10,10 0,-10 0,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'line':
      svgBody = '<path id="line" d="M 0 -10 L 0 10"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'octagon':
      svgBody =
        '<polygon id="octagon" points="-4.142,10 4.142,10 10,4.142 10,-4.142 4.142,-10 -4.142,-10 -10,-4.142 -10,4.142 -4.142,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'parallelogram_left':
      svgBody =
        '<polygon id="parallelogram_left" points="10,5 5,-5 -10,-5 -5,5 10,5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'parallelogram_right':
      svgBody =
        '<polygon id="parallelogram_right" points="5,5 10,-5 -5,-5 -10,5 5,5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'pentagon':
      svgBody =
        '<polygon id="pentagon" points="-9.511,-3.09 -5.878,8.09 5.878,8.09 9.511,-3.09 0,-10 -9.511,-3.09" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'quarter_arc':
      svgBody =
        '<path id="quarter_arc" d="M 0 -10 A 10 10 0 0 0 -10 0"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'quarter_circle':
      svgBody =
        '<path id="quarter_circle" d="M 0 -10 A 10 10 0 0 0 -10 0 L 0 0 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'quarter_square':
      svgBody =
        '<polygon id="quarter_square" points="-10,-10 0,-10 0,0 -10,0 -10,-10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'right_half_triangle':
      svgBody =
        '<polygon id="right_half_triangle" points="-10,10 0,10 0,-10 -10,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'rounded_square':
      svgBody =
        '<rect id="rounded_square" x="-10" y="-10" width="20" height="20" rx="2.5" ry="2.5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'semi_circle':
      svgBody =
        '<path id="semi_circle" d="M -10 0 A -10 -10 0 0 1 10 0 L 0 0 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'shield':
      svgBody =
        '<polygon id="shield" points="10,5 10,-10 -10,-10 -10,5 0,10 10,5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'square':
      svgBody =
        '<polygon id="square" points="-10,-10 10,-10 10,10 -10,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'square_with_corners':
      svgBody =
        '<polygon id="square_with_corners" points="-6.072,10 6.072,10 10,6.072 10,-6.072 6.072,-10 -6.072,-10 -10,-6.072 -10,6.072 -6.072,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'star':
      svgBody =
        '<path id="star" d="M -2.24514,-3.09017 -9.51057,-3.09017 -3.63271,1.18034 -5.87785,8.09017 0,3.81966 5.87785,8.09017 3.63271,1.18034 9.51057,-3.09017 2.24514,-3.09017 0,-10 -2.24514,-3.09017 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'star_diamond':
      svgBody =
        '<path id="star_diamond" d="M -2.70091,-2.70091 -10,0 -2.70091,2.70091 0,10 2.70091,2.70091 10,0 2.70091,-2.70091 0,-10 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'third_arc':
      svgBody =
        '<path id="third_arc" d="M 0 -10 A 10 10 0 0 0 -5 8.66"  style="fill: none; stroke: #000; stroke-width: 1;" />';
      break;
    case 'third_circle':
      svgBody =
        '<path id="third_circle" d="M 0 -10 A 10 10 0 0 0 -5 8.66 L 0 0 Z"  style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'trapezoid':
      svgBody =
        '<polygon id="trapezoid" points="5,-5 10,5 -10,5 -5,-5 5,-5" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    case 'triangle':
      svgBody =
        '<polygon id="triangle" points="-10,10 10,10 0,-10 -10,10" style="fill: #0f0; stroke: #000; stroke-width: 1;" />';
      break;
    default:
      throw new Error('Unknown shape type: ' + shape);
  }

  svgBody = svgBody.replace('fill: #0f0', 'fill: ' + fill);
  svgBody = svgBody.replace('stroke: #000', 'stroke: ' + stroke);
  svgBody = svgBody.replace('stroke-width: 1', 'stroke-width: ' + strokeWidth);

  return svgHeader + svgBody + svgFooter;
}
