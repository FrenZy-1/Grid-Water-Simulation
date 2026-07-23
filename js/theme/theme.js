class Theme {
	static root = document.documentElement;
	static styles = getComputedStyle(this.root);

	static shapeClr;
	static rippleClrs;

	static init() {
		this.rippleClrs = [];

		for (var i = 1; i <= 5; ++i) {
			var shade = i * 100;

			this.rippleClrs.push(
				this.styles.getPropertyValue(`--canvas-ripple-${shade}`).trim(),
			);
		}

		this.update(this.loadVariables(this.styles));
	}

	// Fired when the theme changes
	static updateOnThemeChange() {
		this.update(this.loadVariables(this.styles));
	}

	// Update class variables.
	static update(colors) {
		this.shapeClr = colors;
	}

	static loadVariables(styles) {
		return styles.getPropertyValue("--canvas-shape").trim();
	}
}

export { Theme };
