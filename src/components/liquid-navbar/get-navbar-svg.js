
/**
 * Returns SVG path for navbar rectangle with cutout
 * @param {Object} opts
 * @param {number} opts.rectWidth - rectangle width
 * @param {number} opts.rectHeight - rectangle height
 * @param {number} opts.startY - y-position (from top of rectangle) where cutout starts
 * @param {number} opts.cutoutWidth - width of cutout (not including curves)
 * @param {number} opts.cutoutHeight - height of cutout (not including top/bottom right curve)
 * @param {number} opts.topRightCutoutCurveRadius - radius of top curve into cutout
 * @param {number} opts.bottomRightCutoutCurveRadius - radius of bottom curve out of cutout
 * @param {number} opts.topCornerCurveRadius - border radius of top right corner of rectangle
 * @param {number} opts.bottomCornerCurveRadius - border radius of bottom right corner of rectangle
 * @returns {string} SVG path data
 */
export default function getNavbarRect({
  rectWidth = 150,
  rectHeight = 800,
  startY = 280,
  cutoutWidth = 70,
  cutoutHeight = 45,
  topRightCutoutCurveRadius = 30,
  bottomRightCutoutCurveRadius = 30,
  topCornerCurveRadius = 40,
  bottomCornerCurveRadius = 40
} = {}) {
  return `
    m0 0h${rectWidth-topCornerCurveRadius}
    c${topCornerCurveRadius} 0 ${topCornerCurveRadius} 0 ${topCornerCurveRadius} ${topCornerCurveRadius}
    v${startY-topRightCutoutCurveRadius}
    c0 0 0 ${topRightCutoutCurveRadius} ${-topRightCutoutCurveRadius} ${topRightCutoutCurveRadius}
    h${-cutoutWidth}
    c${-cutoutHeight} 0${-cutoutHeight} ${cutoutHeight} 0 ${cutoutHeight}
    h${cutoutWidth}
    c${bottomRightCutoutCurveRadius} 0 ${bottomRightCutoutCurveRadius} ${bottomRightCutoutCurveRadius} ${bottomRightCutoutCurveRadius} ${bottomRightCutoutCurveRadius} 
    v${rectHeight-startY-topRightCutoutCurveRadius-cutoutHeight-bottomRightCutoutCurveRadius-bottomCornerCurveRadius}
    c0 ${bottomCornerCurveRadius} 0 ${bottomCornerCurveRadius}-${bottomCornerCurveRadius} ${bottomCornerCurveRadius}
    h${-(rectWidth-bottomCornerCurveRadius)}
    v${-rectHeight}
    Z
  `;
}

// m0 0h110c40 0 40 40 40 40v240c0 0 0 30-30 30h-70c-45 0-45 45 0 45h70c30 0 30 30 30 30v200c0 40 0 40-40 40h-110v-625Z