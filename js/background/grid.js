import { Config } from "../shared/config.js";

import { Canvas } from "../canvas/canvas.js";
import { Theme } from "../theme/theme.js";

import { Cell } from "./cell.js";

class Grid {
	margin = {
		top: Config.grid.margin.top,
		left: Config.grid.margin.left,
		bottom: Config.grid.margin.bottom,
		right: Config.grid.margin.right,
	};

	gap = {
		x: 0,
		y: 0,
	};

	start = {
		x: 0,
		y: 0,
	};

	cells;
	waveBuffer;

	// Constructs the grid. Theming will be pulled from the theme class.
	constructor(gaX, gaY) {
		this.gap = {
			x: gaX,
			y: gaY,
		};

		this.start = {
			x: 0,
			y: 0,
		};

		this.build();
	}

	// Build the grid on page load or on resize
	build() {
		this.cells = [];

		const validDrawWidth =
			Canvas.canvas.clientWidth - this.margin.left - this.margin.right;
		const validDrawHeight =
			Canvas.canvas.clientHeight - this.margin.top - this.margin.bottom;

		const columns = Math.floor(validDrawWidth / this.gap.x);
		const rows = Math.floor(validDrawHeight / this.gap.y);

		const gridWidth = (columns - 1) * this.gap.x;
		const gridHeight = (rows - 1) * this.gap.y;

		this.start.x = this.margin.left + (validDrawWidth - gridWidth) / 2;
		this.start.y = this.margin.top + (validDrawHeight - gridHeight) / 2;

		for (var row = 0; row < rows; ++row) {
			var rowArr = [];

			for (var column = 0; column < columns; ++column) {
				const cell = new Cell(
					this.start.x + column * this.gap.x,
					this.start.y + row * this.gap.y,
				);
				rowArr.push(cell);
			}

			this.cells.push(rowArr);
		}
	}

	// Render the all the cells
	render() {
		this.cells.forEach((row, i) => {
			const bufferRow = this.waveBuffer[i];

			row.forEach((cell, j) => {
				const bufferCell = bufferRow[j];

				const size =
					Config.cell.size +
					bufferCell.height * Config.cell.maxHeight;
				const t = Math.min(Math.abs(bufferCell.height), 4) / 4; // 0 → 1
				const color =
					t < 0.01
						? Theme.shapeClr
						: // : Theme.rippleClrs[Math.min(Math.floor(t * 5), 4)];
							Theme.rippleClrs[
								4 - Math.min(Math.floor(t * 5), 4)
							];

				cell.draw(size, color);
			});
		});
	}
}

export { Grid };
