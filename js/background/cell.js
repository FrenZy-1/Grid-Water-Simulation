import { Config } from "../shared/config.js";

import { Canvas } from "../canvas/canvas.js";
import { Theme } from "../theme/theme.js";

class Cell {
	x;
	y;

	size = Config.cell.state.normal.size; // Default size of the diamond.
	color = Theme.shapeClr; // Default color. Based on light/dark mode.

	delay = undefined;
	isRippling = false;

	targetSize = undefined; // For required size during animation.
	targetColor = undefined; // For end point of color change.

	selfState = Config.cell.state.normal.id; // For determining if re-rendering is required.

	radius = Config.cell.effect.radius; // Each cell might have different radius.

	// Default size is 5.
	constructor(x, y, size = Config.cell.state.normal.size) {
		this.x = x;
		this.y = y;

		this.size = size;
	}

	// Animation loop
	animate(ease, onComplete) {
		if (this.selfState === Config.cell.state.click.id && this.isRippling)
			return;
		gsap.killTweensOf(this);

		gsap.to(this, {
			size: this.targetSize,
			color: this.targetColor,
			ease: ease,
			duration: Config.animation.duration,
			delay: this.delay,
			onComplete,
		});
	}

	// For use when animating
	dynamicRender() {
		const offset = this.size / Math.SQRT2;
		const padding = 4;

		Canvas.ctx.clearRect(
			this.x - offset - padding,
			this.y - offset - padding,
			offset * 2 + padding * 2,
			offset * 2 + padding * 2,
		);

		this.staticRender();
	}

	// Render from center
	staticRender() {
		// Set the style
		Canvas.ctx.fillStyle = this.color;

		// Calc the offset
		const offset = this.size / Math.SQRT2;

		// Start drawing the diamond
		Canvas.ctx.beginPath();
		Canvas.ctx.moveTo(this.x, this.y);

		// Move to the remaining points
		Canvas.ctx.lineTo(this.x, this.y - offset);
		Canvas.ctx.lineTo(this.x + offset, this.y);
		Canvas.ctx.lineTo(this.x, this.y + offset);
		Canvas.ctx.lineTo(this.x - offset, this.y);
		Canvas.ctx.lineTo(this.x, this.y - offset);

		// Close the path
		Canvas.ctx.closePath();

		// Fill the shape
		Canvas.ctx.fill();
	}
}

export { Cell };
