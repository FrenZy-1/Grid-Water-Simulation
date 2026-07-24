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
	constructor(gapX, gapY) {
		this.gap = {
			x: gapX,
			y: gapY,
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

		for (let row = 0; row < rows; ++row) {
			let rowArr = [];

			for (let column = 0; column < columns; ++column) {
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
			const waveBufferRow = this.waveBuffer?.[i];
			if (!waveBufferRow) return;

			row.forEach((cell, j) => {
				const waveBufferCell = waveBufferRow[j];

				const size =
					Config.cell.size +
					waveBufferCell.height * Config.cell.maxHeight;
				const normalizedHeight =
					Math.min(Math.abs(waveBufferCell.height), 4) / 4; // 0 → 1
				const color =
					normalizedHeight < 0.01
						? Theme.shapeClr
						: // : Theme.rippleClrs[Math.min(Math.floor(normalizedHeight * 5), 4)];
							Theme.rippleClrs[
								4 -
									Math.min(
										Math.floor(normalizedHeight * 5),
										4,
									)
							];

				cell.draw(size, color);
			});
		});
	}
}

export { Grid };
