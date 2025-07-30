export type RectParams = {
  rectWidth: number,
  rectHeight: number,
  startY: number,
  cutoutWidth: number,
  cutoutHeight: number,
  topRightCutoutCurveRadius: number,
  bottomRightCutoutCurveRadius: number,
  topCornerCurveRadius: number,
  bottomCornerCurveRadius: number,
  topRightCutoutCurveHeight?: number,
  bottomRightCutoutCurveHeight?: number
}

/**
 * Returns SVG path for navbar rectangle with cutout
 * @param {Object} opts
 * @param {number} opts.rectWidth - rectangle width
 * @param {number} opts.rectHeight - rectangle height
 * @param {number} opts.startY - y-position (from top of rectangle) where cutout starts
 * @param {number} opts.cutoutWidth - width of cutout (including curves)
 * @param {number} opts.cutoutHeight - height of cutout (not including top/bottom right curve)
 * @param {number} opts.topRightCutoutCurveRadius - radius of top curve into cutout
 * @param {number} opts.bottomRightCutoutCurveRadius - radius of bottom curve out of cutout
 * @param {number} opts.topCornerCurveRadius - border radius of top right corner of rectangle
 * @param {number} opts.bottomCornerCurveRadius - border radius of bottom right corner of rectangle
 * @returns {string} SVG path data
 */
export default function getNavbarRect({
  rectWidth,
  rectHeight,
  startY,
  cutoutWidth,
  cutoutHeight,
  topRightCutoutCurveRadius,
  bottomRightCutoutCurveRadius,
  topCornerCurveRadius,
  bottomCornerCurveRadius,
  topRightCutoutCurveHeight = topRightCutoutCurveRadius,
  bottomRightCutoutCurveHeight = bottomRightCutoutCurveRadius
}: RectParams) {
  const leftCutoutCurveWidth = cutoutHeight * 0.75;
  return `
    m0 0
    h${rectWidth-topCornerCurveRadius}
    c${topCornerCurveRadius} 0 ${topCornerCurveRadius} 0 ${topCornerCurveRadius} ${topCornerCurveRadius}
    v${startY-topCornerCurveRadius-topRightCutoutCurveHeight}
    c0 0 0 ${topRightCutoutCurveHeight} ${-topRightCutoutCurveRadius} ${topRightCutoutCurveHeight}
    h${-(cutoutWidth - leftCutoutCurveWidth - topRightCutoutCurveRadius)}
    c${-cutoutHeight} 0 ${-cutoutHeight} ${cutoutHeight} 0 ${cutoutHeight}
    h${cutoutWidth - leftCutoutCurveWidth - bottomRightCutoutCurveRadius}
    c${bottomRightCutoutCurveRadius} 0 ${bottomRightCutoutCurveRadius} ${bottomRightCutoutCurveHeight} ${bottomRightCutoutCurveRadius} ${bottomRightCutoutCurveHeight} 
    v${rectHeight-startY-cutoutHeight-bottomRightCutoutCurveHeight-bottomCornerCurveRadius-topCornerCurveRadius}
    c0 ${bottomCornerCurveRadius} 0 ${bottomCornerCurveRadius} ${-bottomCornerCurveRadius} ${bottomCornerCurveRadius}
    h${-(rectWidth-bottomCornerCurveRadius)}
    v${-rectHeight}
    z
  `;
}

// m0 0h110c40 0 40 40 40 40v240c0 0 0 30-30 30h-70c-45 0-45 45 0 45h70c30 0 30 30 30 30v200c0 40 0 40-40 40h-110v-625Z