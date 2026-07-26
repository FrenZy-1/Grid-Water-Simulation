import { Config } from "../shared/config.js";

import { Canvas } from "./canvas/canvas.js";
import { Theme } from "../theme/theme.js";

class Cell {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	// Render from center
	draw(size = Config.cell.size, color = Theme.shapeClr) {
		// Set the style
		Canvas.ctx.fillStyle = color;

		// Calc the offset
		const offset = size / Math.SQRT2;

		// Start drawing the diamond
		Canvas.ctx.beginPath();
		Canvas.ctx.moveTo(this.x, this.y - offset);

		// Move to the remaining points
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
