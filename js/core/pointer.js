import { Config } from "../shared/config.js";

class Pointer {
	static curr = {
		x: 0,
		y: 0,
	};

	static intensity = 0;

	static onUp = null;
	static onMove = null;

	// Get the pos of the mouse from 'mousemove'
	static init() {
		window.addEventListener("pointermove", (e) => {
			this.update(e);

			Pointer.onMove?.();
		});

		window.addEventListener("pointerdown", (e) => {
			this.update(e);
			this.intensity = performance.now();
		});

		window.addEventListener("pointerup", (e) => {
			this.update(e);
			this.intensity = Math.min(
				(performance.now() - this.intensity) / 1000,
				1,
			);

			Pointer.onUp?.();
		});
	}

	// Helper
	static update(e) {
		this.curr.x = e.clientX;
		this.curr.y = e.clientY;
	}
}

export { Pointer };
