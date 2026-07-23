class Canvas {
	static canvas = document.getElementById("mainCanvas");
	static ctx = this.canvas.getContext("2d");

	static onResize = null;

	static init() {
		this.setDimensions();

		window.addEventListener("resize", () => {
			this.resize();
		});
	}

	static update() {
		this.ctx.clearRect(
			0,
			0,
			this.canvas.clientWidth,
			this.canvas.clientHeight,
		);
	}

	static setDimensions() {
		this.update();

		const dpr = window.devicePixelRatio || 1;

		this.canvas.width = Math.floor(window.innerWidth * dpr);
		this.canvas.height = Math.floor(window.innerHeight * dpr);

		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";

		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	static resize() {
		this.setDimensions();
		this.onResize?.();
	}
}

export { Canvas };
