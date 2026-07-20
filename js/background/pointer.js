import { Config } from "../shared/config.js";

class Pointer {
	static curr = {
		x: 0,
		y: 0,
	};

	static prev = {
		x: 0,
		y: 0,
	};

	static isDown = false;
	static intensity = 0;

	// Get the pos of the mouse from 'mousemove'
	static init(grid) {
		window.addEventListener("pointermove", (e) => {
			this.updatePrev(this.curr.x, this.curr.y);
			this.update(e);
			this.intensity = performance.now();

			const coords = grid.calcCell(this.curr.x, this.curr.y);
			const prevCoords = grid.calcCell(this.prev.x, this.prev.y);

			if (
				coords === undefined ||
				prevCoords === undefined ||
				prevCoords.column !== coords.column ||
				prevCoords.row !== coords.row
			)
				grid.animate(
					prevCoords,
					Config.cell.state.normal.id,
					"power2.out",
				);

			if (this.isDown) {
				grid.animate(coords, Config.cell.state.click.id, "power2.out");
			} else {
				grid.animate(coords, Config.cell.state.hover.id, "power2.out");
			}
		});

		window.addEventListener("pointerdown", (e) => {
			this.update(e);
			this.isDown = true;
			this.intensity = performance.now();

			grid.animate(
				grid.calcCell(this.curr.x, this.curr.y),
				Config.cell.state.click.id,
				"power2.in",
			);
		});

		window.addEventListener("pointerup", (e) => {
			this.update(e);
			this.isDown = false;
			this.intensity = Math.min(
				(performance.now() - this.intensity) / 1000,
				1,
			);

			const coords = grid.calcCell(this.curr.x, this.curr.y);

			if (e.pointerType === "touch") {
				grid.animate(coords, Config.cell.state.normal.id, "power2.out");
				return;
			}

			grid.wave(coords, this.intensity);
			grid.animate(coords, Config.cell.state.hover.id, "power2.in");
		});
	}

	// Helper
	static update(e) {
		this.curr.x = e.clientX;
		this.curr.y = e.clientY;
	}

	static updatePrev(x, y) {
		this.prev.x = x;
		this.prev.y = y;
	}
}

export { Pointer };
