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
export const getShapeSvg = (shape = 'circle', { fill = '#fff', stroke = '#000', strokeWidth = '1', dimensions = 40 } = {}) => {
    const svgHeader = '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="' + dimensions + '" ' +
        'height="' + dimensions + '" ' +
        'viewBox = "-12 -12 24 24">';
    const svgFooter = '</svg>';
    let svgBody = '';
    // Shape definitions, all are roughly scaled to 20x20 in coordinates between (-10,-10) to (10,10)
    switch (shape) {
        case 'arrow':
            svgBody += 'd="M 0,-10 L 5,-5 L 2.5,-5 L 2.5,10 L -2.5,10 L -2.5,-5 L -5,-5 L 0,-10 Z" ';
            break;
        case 'arrowhead':
            svgBody += 'd="M -10 -10 L 0 0 L -10 10" ';
            break;
        case 'asterisk_fill':
            svgBody = 'd="M -1.5,-10 L 1.5,-10L 1.5,-3.939 L 6.011,-8.132 L 8.132,-6.011 L 3.939,-1.5 L 10,-1.5 L 10,1.5 ' +
                'L 3.939,1.5 L 8.132,6.011 L 6.011,8.132 L 1.5,3.939 L 1.5,10 L -1.5,10 L -1.5,3.939 L -6.011,8.132 ' +
                'L -8.132,6.011 L -3.939,1.5 L -10,1.5 L -10,-1.5 L -3.939,-1.5 L -8.132,-6.011 L -6.011,-8.132 ' +
                'L -1.5,-3.939 L -1.5,-10 Z" ';
            break;
        case 'circle':
            svgBody = 'cx="0" cy="0" r="10" ';
            break;
        case 'cross':
            svgBody = 'd="M -10 0 L 10 0 M 0 -10 L 0 10" ';
            break;
        case 'cross2':
            svgBody = 'd="M -10 -10 L 10 10 M 10 -10 L -10 10" ';
            break;
        case 'cross_fill':
            svgBody = 'd="M -10,-2 L -10,-2 L -10,2 L -2,2 L -2,10 L 2,10 L 2,2 L 10,2 L 10,-2 L 2,-2 L 2,-10 L -2,-10 ' +
                'L -2,-2 L -10,-2 Z" ';
            break;
        case 'decagon':
            svgBody = 'points="5.878,8.09 9.511,3.09 9.511,-3.09 5.878,-8.09 0,-10 -5.878,-8.09 -9.511,-3.09 -9.511,3.09 ' +
                '-5.878,8.09 0,10 5.878,8.09" ';
            break;
        case 'diagonal_half_square':
            svgBody = 'points="-10,-10 10,10 -10,10 -10,-10" ';
            break;
        case 'diamond':
            svgBody = 'points="-10,0 0,10 10,0 0,-10 -10,0" ';
            break;
        case 'equilateral_triangle':
            svgBody = 'points="-8.66,5 8.66,5 0,-10 -8.66,5" ';
            break;
        case 'filled_arrowhead':
            svgBody = 'd="M 0,0 L -10,10 L -10,-10 L 0,0 Z" ';
            break;
        case 'half_arc':
            svgBody = 'd="M -10 0 A -10 -10 0 0 1 10 0" ';
            break;
        case 'half_square':
            svgBody = 'points="-10,-10 0,-10 0,10 -10,10 -10,-10" ';
            break;
        case 'heart':
            svgBody = 'd="M -9.5 -2 A 1 1 0 0 1 0 -7.5 A 1 1 0 0 1 9.5 -2 L 0 10 Z" ';
            break;
        case 'hexagon':
            svgBody = 'points="-8.66,-5 -8.66,5 0,10 8.66,5 8.66,-5 0,-10 -8.66,-5" ';
            break;
        case 'left_half_triangle':
            svgBody = 'points="0,10 10,10 0,-10 0,10" ';
            break;
        case 'line':
            svgBody = 'd="M 0 -10 L 0 10" ';
            break;
        case 'octagon':
            svgBody = 'points="-4.142,10 4.142,10 10,4.142 10,-4.142 4.142,-10 -4.142,-10 -10,-4.142 -10,4.142 -4.142,10" ';
            break;
        case 'parallelogram_left':
            svgBody = 'points="10,5 5,-5 -10,-5 -5,5 10,5" ';
            break;
        case 'parallelogram_right':
            svgBody = 'points="5,5 10,-5 -5,-5 -10,5 5,5" ';
            break;
        case 'pentagon':
            svgBody = 'points="-9.511,-3.09 -5.878,8.09 5.878,8.09 9.511,-3.09 0,-10 -9.511,-3.09" ';
            break;
        case 'quarter_arc':
            svgBody = 'd="M 0 -10 A 10 10 0 0 0 -10 0" ';
            break;
        case 'quarter_circle':
            svgBody = 'd="M 0 -10 A 10 10 0 0 0 -10 0 L 0 0 Z" ';
            break;
        case 'quarter_square':
            svgBody = 'points="-10,-10 0,-10 0,0 -10,0 -10,-10" ';
            break;
        case 'right_half_triangle':
            svgBody = 'points="-10,10 0,10 0,-10 -10,10" ';
            break;
        case 'rounded_square':
            svgBody = 'x="-10" y="-10" width="20" height="20" rx="2.5" ry="2.5" ';
            break;
        case 'semi_circle':
            svgBody = 'd="M -10 0 A -10 -10 0 0 1 10 0 L 0 0 Z" ';
            break;
        case 'shield':
            svgBody = 'points="10,5 10,-10 -10,-10 -10,5 0,10 10,5" ';
            break;
        case 'square':
            svgBody = 'points="-10,-10 10,-10 10,10 -10,10" ';
            break;
        case 'square_with_corners':
            svgBody = 'points="-6.072,10 6.072,10 10,6.072 10,-6.072 6.072,-10 -6.072,-10 -10,-6.072 -10,6.072 -6.072,10" ';
            break;
        case 'star':
            svgBody = 'd="M -2.24514,-3.09017 -9.51057,-3.09017 -3.63271,1.18034 -5.87785,8.09017 0,3.81966 ' +
                '5.87785,8.09017 3.63271,1.18034 9.51057,-3.09017 2.24514,-3.09017 0,-10 -2.24514,-3.09017 Z" ';
            break;
        case 'star_diamond':
            svgBody = 'd="M -2.70091,-2.70091 -10,0 -2.70091,2.70091 0,10 2.70091,2.70091 10,0 2.70091,-2.70091 0,-10 Z" ';
            break;
        case 'third_arc':
            svgBody = 'd="M 0 -10 A 10 10 0 0 0 -5 8.66" ';
            break;
        case 'third_circle':
            svgBody = 'd="M 0 -10 A 10 10 0 0 0 -5 8.66 L 0 0 Z" ';
            break;
        case 'trapezoid':
            svgBody = 'points="5,-5 10,5 -10,5 -5,-5 5,-5" ';
            break;
        case 'triangle':
            svgBody = 'points="-10,10 10,10 0,-10 -10,10" ';
            break;
        default:
            throw new Error('Unknown shape type: ' + shape);
    }
    // Depending on the shape definition use different SVG elements
    if (svgBody.startsWith('points=')) {
        svgBody = '<polygon id = "' + shape + '" ' + svgBody;
    }
    else if (svgBody.startsWith('x=')) {
        svgBody = '<rect id = "' + shape + '" ' + svgBody;
    }
    else if (svgBody.startsWith('cx=')) {
        svgBody = '<circle id = "' + shape + '" ' + svgBody;
    }
    else {
        svgBody = '<path id = "' + shape + '" ' + svgBody;
    }
    // For shapes that are just lines, make fill equal to none
    switch (shape) {
        case 'arrowhead':
        case 'cross':
        case 'cross2':
        case 'half_arc':
        case 'line':
        case 'quarter_arc':
        case 'third_arc':
            svgBody += 'style="fill: none; stroke: ' + stroke + '; stroke-width: ' + strokeWidth + ';" />';
            break;
        default:
            svgBody += 'style="fill: ' + fill + '; stroke: ' + stroke + '; stroke-width: ' + strokeWidth + ';" />';
    }
    return svgHeader + svgBody + svgFooter;
};
/**
 * Extracts the properties of an SVG string into an object.
 *
 * @param svgString the SVG string to parse
 * @returns an object containing the SVG properties
 */
export const getSvgProperties = (svgString) => {
    try {
        // Parse the XML string into a document
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgString, 'application/xml');
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Invalid XML format');
        }
        // Get the first <svg> element
        const svgElement = xmlDoc.querySelector('svg');
        if (!svgElement) {
            throw new Error('<svg> element not found');
        }
        // If <svg> exists, return the value of the 'width' attribute
        const width = svgElement?.getAttribute('width');
        // Get the first child element of <svg>
        const firstChildElement = Array.from(svgElement?.children).find((child) => {
            return child instanceof Element;
        });
        // Get the id and style from the first child element
        const id = firstChildElement?.getAttribute('id') ?? '';
        const styleString = firstChildElement?.getAttribute('style') ?? '';
        // Split the style string into individual declarations
        const styles = styleString.split(';').filter((style) => style.trim() !== '');
        // Convert the declarations into a key-value map
        const styleMap = {};
        for (const style of styles) {
            const [key, value] = style.split(':').map((str) => str.trim());
            if (key && value) {
                styleMap[key] = value;
            }
        }
        const svgOpts = {
            id: id,
            dimensions: Number(width) ? Number(width) : 0,
            fill: styleMap.fill || '',
            stroke: styleMap.stroke || '',
            strokeWidth: styleMap['stroke-width'] || ''
        };
        return svgOpts;
    }
    catch (error) {
        throw new Error('Error parsing SVG');
    }
};
//# sourceMappingURL=svgs.js.map