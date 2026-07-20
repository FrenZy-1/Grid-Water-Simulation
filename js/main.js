import { Config } from "./shared/config.js";

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
		const grid = new Grid(
			Config.grid.offset.top,
			Config.grid.offset.left,
			Config.grid.gap.column,
			Config.grid.gap.row,
		);
		Pointer.init(grid);

		return grid;
	}

	static loop(grid) {
		for (const cell of Grid.dirtyCells) {
			cell.dynamicRender();
		}

		requestAnimationFrame(() => App.loop(grid));
	}
}

App.run();
