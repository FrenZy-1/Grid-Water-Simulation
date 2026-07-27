class Canvas {
	static canvas;
	static ctx;

	static onResize = null;

	static init() {
		this.canvas = document.getElementById("mainCanvas");
		this.ctx = this.canvas.getContext("2d");

		this.setDimensions();

		window.addEventListener("resize", () => {
			this.resize();
		});
	}

	static update() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	static setDimensions() {
		this.update();

		const root = document.documentElement;
		const dpr = window.devicePixelRatio || 1;

		this.canvas.width = Math.floor(root.clientWidth * dpr);
		this.canvas.height = Math.floor(root.clientHeight * dpr);

		this.canvas.style.width = root.clientWidth + "px";
		this.canvas.style.height = root.clientHeight + "px";

		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	static resize() {
		this.setDimensions();
		this.onResize?.();
	}
}

export { Canvas };
