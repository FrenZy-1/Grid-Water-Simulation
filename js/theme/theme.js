class Theme {
	static shapeClr;
	static hoverClr;
	static clickClr;
	static rippleClrs = []; // For the ripple generated after clicking. Will prolly use a shade of accent color.

	static init() {
		const root = document.documentElement;
		const styles = getComputedStyle(root);

		this.rippleClrs = [];

		for (var i = 1; i <= 5; ++i) {
			var shade = i * 100;

			this.rippleClrs.push(
				styles.getPropertyValue(`--canvas-ripple-${shade}`).trim(),
			);
		}

		this.hoverClr = this.clickClr = this.rippleClrs[4];

		this.update(this.loadVariables(styles));
	}

	// Fired when the theme changes
	static updateOnThemeChange() {
		const root = document.documentElement;
		const styles = getComputedStyle(root);

		this.update(this.loadVariables(styles));
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
