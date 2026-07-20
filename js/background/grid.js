import { Config } from "../shared/config.js";

import { canvas } from "../canvas/canvas.js";
import { Theme } from "../theme/theme.js";

import { Cell } from "./cell.js";

class Grid {
	gridX;
	gridY;

	gapX;
	gapY;

	cells = [];
	static dirtyCells = new Set();

	// Constructs the grid. Theming will be pulled from the theme class.
	constructor(gX, gY, gaX, gaY) {
		this.gridX = gX;
		this.gridY = gY;

		this.gapX = gaX;
		this.gapY = gaY;

		this.create(Config.cell.state.normal.size);
		this.render();
	}

	// Sets delays based on distance.
	animate(coords, state, ease) {
		if (coords === undefined) return;

		const tokens = this.lookupValues(state);
		if (tokens === undefined) return;

		const startY = Math.max(0, coords.row - Config.cell.effect.limit);
		const endY = Math.min(
			this.cells.length - 1,
			coords.row + Config.cell.effect.limit,
		);

		const startX = Math.max(0, coords.column - Config.cell.effect.limit);
		const endX = Math.min(
			this.cells[0].length - 1,
			coords.column + Config.cell.effect.limit,
		);

		// Radial effect + Pulse
		for (var y = startY; y <= endY; ++y) {
			for (var x = startX; x <= endX; ++x) {
				const currCell = this.cells[y][x];

				const dist = Math.floor(
					Math.abs(x - coords.column) + Math.abs(y - coords.row),
				);
				if (dist > Config.cell.effect.limit) continue;

				currCell.delay =
					state === Config.cell.state.click.id
						? dist * Config.animation.click.delay
						: dist * Config.animation.hover.delay;

				currCell.targetSize =
					state === Config.cell.state.normal.id
						? tokens.size
						: tokens.size - dist * Config.cell.effect.steps <=
							  Config.cell.state.normal.size
							? Config.cell.state.normal.size
							: state === Config.cell.state.click.id
								? tokens.size -
									dist * (Config.cell.effect.steps + 1)
								: tokens.size - dist * Config.cell.effect.steps;
				currCell.targetColor =
					state === Config.cell.state.normal.id
						? tokens.color
						: tokens.color[tokens.color.length - 1 - dist];

				if (currCell.selfState !== state && !currCell.isRippling) {
					currCell.selfState = state;
					Grid.dirtyCells.add(currCell);
					currCell.animate(ease, () => {
						Grid.dirtyCells.delete(currCell);
					});
				}
			}
		}
	}

	wave(coords, intensity) {
		if (coords === undefined) return;

		for (var y = 0; y < this.cells.length; ++y) {
			for (var x = 0; x < this.cells[y].length; ++x) {
				const currCell = this.cells[y][x];

				const dist = Math.round(
					Math.hypot(coords.column - x, coords.row - y),
				);
				const normDist = dist / Config.wave.width.ring;

				if (dist > Config.wave.width.ring) continue;

				currCell.delay = dist / (intensity * Config.wave.speed);
				currCell.targetSize =
					Config.cell.state.click.size -
					(1 - normDist) *
						(Config.cell.state.click.size -
							Config.cell.state.normal.size);
				currCell.targetColor =
					Theme.rippleClrs[
						Math.floor((1 - normDist) * Theme.rippleClrs.length)
					];

				if (currCell.selfState !== Config.cell.state.click.id) {
					currCell.selfState = Config.cell.state.click.id;
					currCell.isRippling = true;
					Grid.dirtyCells.add(currCell);

					gsap.killTweensOf(currCell);
					gsap.to(currCell, {
						size: currCell.targetSize,
						color: currCell.targetColor,
						ease: "power2.out",
						duration: Config.animation.duration,
						delay: currCell.delay,
						onComplete: () => {
							gsap.to(currCell, {
								size: Config.cell.state.normal.size,
								color: Theme.shapeClr,
								ease: "power2.in",
								duration: Config.animation.duration,
								delay: currCell.delay * Config.wave.delay.peak,
								onComplete: () => {
									currCell.isRippling = false;
									currCell.selfState =
										Config.cell.state.normal.id;
									Grid.dirtyCells.delete(currCell);
								},
							});
						},
					});
				}
			}
		}
	}

	// Create grid without rendering
	create() {
		for (
			var i = this.gridY;
			i < canvas.clientHeight - this.gapY;
			i += this.gapY
		) {
			var row = [];

			for (
				var j = this.gridX;
				j < canvas.clientWidth - this.gapX;
				j += this.gapX
			) {
				const cell = new Cell(j, i, Config.cell.state.normal.size);
				row.push(cell);
			}

			this.cells.push(row);
		}
	}

	render() {
		this.cells.forEach((row) => {
			row.forEach((cell) => {
				cell.staticRender();
			});
		});
	}

	// Calculates effect radius.
	calcCell(px, py) {
		const rawColumn = Math.floor(
			(px - this.gridX + this.gapX / 2) / this.gapX,
		);
		const rawRow = Math.floor(
			(py - this.gridY + this.gapY / 2) / this.gapY,
		);

		const column = Math.max(
			0,
			Math.min(rawColumn, this.cells[0].length - 1),
		);
		const row = Math.max(0, Math.min(rawRow, this.cells.length - 1));

		const cell = this.cells[row][column];
		const dist = Math.hypot(px - cell.x, py - cell.y);

		if (dist <= cell.radius) {
			return { column, row };
		}
	}

	// State based lookup
	lookupValues(currState) {
		switch (currState) {
			case Config.cell.state.click.id:
				return {
					size: Config.cell.state.click.size,
					color: Theme.rippleClrs,
				};
			case Config.cell.state.hover.id:
				return {
					size: Config.cell.state.hover.size,
					color: Theme.rippleClrs,
				};
			case Config.cell.state.normal.id:
				return {
					size: Config.cell.state.normal.size,
					color: [Theme.shapeClr],
				};
			default:
				return undefined;
		}
	}

	// Center the grid before rendering
	center() {
		// const w = ;
	}
}

export { Grid };
