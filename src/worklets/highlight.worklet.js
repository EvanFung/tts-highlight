class HighlightPainter {
  static get inputProperties() {
    return [
      '--highlight-x',
      '--highlight-y',
      '--highlight-width',
      '--highlight-height'
    ];
  }

  paint(ctx, size, properties) {
    const x = parseFloat(properties.get('--highlight-x').toString()) || 0;
    const y = parseFloat(properties.get('--highlight-y').toString()) || 0;
    const width = parseFloat(properties.get('--highlight-width').toString()) || 0;
    const height = parseFloat(properties.get('--highlight-height').toString()) || 0;

    if (width === 0) return;

    // Ensure we don't paint outside the container bounds
    const boundedX = Math.max(0, Math.min(x, size.width));
    const boundedWidth = Math.min(width, size.width - boundedX);
    const boundedY = Math.max(0, Math.min(y, size.height));
    const boundedHeight = Math.min(height, size.height - boundedY);

    ctx.fillStyle = '#818cf866';

    // Center the highlight vertically around the text
    const adjustedY = boundedY ;
    const adjustedHeight = boundedHeight * 1.2;

    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(boundedX, adjustedY, boundedWidth, adjustedHeight, 4);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(boundedX + 4, adjustedY);
      ctx.lineTo(boundedX + boundedWidth - 4, adjustedY);
      ctx.quadraticCurveTo(boundedX + boundedWidth, adjustedY, boundedX + boundedWidth, adjustedY + 4);
      ctx.lineTo(boundedX + boundedWidth, adjustedY + adjustedHeight - 4);
      ctx.quadraticCurveTo(boundedX + boundedWidth, adjustedY + adjustedHeight, boundedX + boundedWidth - 4, adjustedY + adjustedHeight);
      ctx.lineTo(boundedX + 4, adjustedY + adjustedHeight);
      ctx.quadraticCurveTo(boundedX, adjustedY + adjustedHeight, boundedX, adjustedY + adjustedHeight - 4);
      ctx.lineTo(boundedX, adjustedY + 4);
      ctx.quadraticCurveTo(boundedX, adjustedY, boundedX + 4, adjustedY);
      ctx.fill();
    }
  }
}

registerPaint('highlight', HighlightPainter);
