class Theme {
    static root = document.documentElement;
    static styles = getComputedStyle(this.root);

    static shapeClr;
    static rippleClrs;

    static init() {
        this.shapeClr = this.styles.getPropertyValue("--text").trim();
        this.rippleClrs = [];

        for (let i = 1; i <= 5; ++i) {
            let shade = i * 100;

            this.rippleClrs.push(
                this.styles.getPropertyValue(`--canvas-ripple-${shade}`).trim(),
            );
        }
    }
}

export { Theme };
