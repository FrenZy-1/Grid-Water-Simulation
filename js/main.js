import { Config } from "./shared/config.js";

import { Canvas } from "./canvas/canvas.js";
import { WaveEngine } from "./background/waveEngine.js";
import { Grid } from "./background/grid.js";
import { Theme } from "./theme/theme.js";
import { Pointer } from "./background/pointer.js";

class App {
	// Main event loop
	static run() {
		const grid = this.init();
		this.loop(grid);
	}

	// Aux functions
	static init() {
		Theme.init();
		Canvas.init();

		const grid = new Grid(Config.grid.gap.column, Config.grid.gap.row);
		Canvas.onResize = () => {
			grid.build();
		};

		WaveEngine.init(grid.cells[0].length, grid.cells.length);
		grid.waveBuffer = WaveEngine.waveBuffer;

		Pointer.init();
		Pointer.onMove = () => {
			App.injectWave(Pointer.curr.x, Pointer.curr.y, grid);
		};
		Pointer.onUp = () => {
			const r = Math.round((Pointer.curr.y - grid.start.y) / grid.gap.y);
			const c = Math.round((Pointer.curr.x - grid.start.x) / grid.gap.x);

			WaveEngine.inject(
				c,
				r,
				Config.wave.force.click * Pointer.intensity,
			);
		};

		return grid;
	}

	static loop(grid) {
		Canvas.update();
		WaveEngine.update();
		grid.render();

		requestAnimationFrame(() => App.loop(grid));
	}

	static injectWave(mouseX, mouseY, grid) {
		const radius = Config.wave.effect.radius;

		const colStart = Math.floor(
			(mouseX - radius - grid.start.x) / grid.gap.x,
		);
		const colEnd = Math.ceil((mouseX + radius - grid.start.x) / grid.gap.x);
		const rowStart = Math.floor(
			(mouseY - radius - grid.start.y) / grid.gap.y,
		);
		const rowEnd = Math.ceil((mouseY + radius - grid.start.y) / grid.gap.y);

		for (var r = rowStart; r <= rowEnd; r++) {
			for (var c = colStart; c <= colEnd; c++) {
				const cell = grid.cells[r]?.[c];
				if (!cell) continue;

				const dx = mouseX - cell.x;
				const dy = mouseY - cell.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > radius) continue;

				const sigma = radius / 3;
				WaveEngine.inject(
					c,
					r,
					Math.exp(-(dist * dist) / (2 * sigma * sigma)) *
						Config.wave.force.hover,
				);
			}
		}
	}
}

App.run();
