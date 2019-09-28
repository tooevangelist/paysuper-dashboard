import { Chart } from 'chart.js';

Chart.helpers.drawRoundedTopRectangle = function drawRoundedTopRectangle(
  ctx,
  x,
  y,
  width,
  height,
  radius,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
  draw: function draw() {
    const { ctx } = this._chart;
    const vm = this._view;
    let left;
    let right;
    let top;
    let bottom;
    let signX;
    let signY;
    let borderSkipped;
    let { borderWidth } = vm;

    if (!vm.horizontal) {
      left = vm.x - vm.width / 2;
      right = vm.x + vm.width / 2;
      top = vm.y;
      bottom = vm.base;
      signX = 1;
      signY = bottom > top ? 1 : -1;
      borderSkipped = vm.borderSkipped || 'bottom';
    } else {
      left = vm.base;
      right = vm.x;
      top = vm.y - vm.height / 2;
      bottom = vm.y + vm.height / 2;
      signX = right > left ? 1 : -1;
      signY = 1;
      borderSkipped = vm.borderSkipped || 'left';
    }

    if (borderWidth) {
      const barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
      borderWidth = borderWidth > barSize ? barSize : borderWidth;
      const halfStroke = borderWidth / 2;
      const borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
      const borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
      const borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
      const borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);

      if (borderLeft !== borderRight) {
        top = borderTop;
        bottom = borderBottom;
      }

      if (borderTop !== borderBottom) {
        left = borderLeft;
        right = borderRight;
      }
    }

    const barWidth = Math.abs(left - right);
    const roundness = this._chart.config.options.borderRadius || 0;
    const radius = barWidth * roundness * 0.5;

    const prevTop = top;

    top = prevTop + radius;
    const barRadius = top - prevTop;

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    Chart.helpers.drawRoundedTopRectangle(
      ctx,
      left,
      top - barRadius + 1,
      barWidth,
      bottom - prevTop,
      barRadius,
    );

    ctx.fill();
    if (borderWidth) {
      ctx.stroke();
    }

    top = prevTop;
  },
});

Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

Chart.controllers.roundedBar = Chart.controllers.bar.extend({
  dataElementType: Chart.elements.RoundedTopRectangle,
});

export default Chart;
