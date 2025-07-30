import * as d3 from 'd3';
import { interpolatePath } from 'd3-interpolate-path';
  
export default function animatePath(fromPath, toPath, svgPathElement, duration = 400) {
  const excludeSegment = (a, b) => {
    console.log(d3.select(svgPathElement).attr('d')); 
    return a.x == b.x;
  };
  const interpolator = interpolatePath(fromPath, toPath, { excludeSegment });
  d3.select(svgPathElement)
    .transition()
    .duration(duration)
    .attrTween('d', () => t => interpolator(t));
}