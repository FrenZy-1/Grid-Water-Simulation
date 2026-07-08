// Canvas setup
var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;

canvas.width = Math.floor(window.innerWidth * dpr);
canvas.height = Math.floor(window.innerHeight * dpr);

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

// Globals
const DIAMOND_SIZE = 6;
const EFFECT_RADIUS = DIAMOND_SIZE * 2;

const HOVER_SIZE = DIAMOND_SIZE * 2;
const CLICK_SIZE = HOVER_SIZE + 8;

const GRIDX = 58;
const GRIDY = 50;

const GAPX = 35;
const GAPY = 35;

// Enums
const state = Object.freeze({
	NORMAL: 0,
	HOVER: 1,
	CLICK: 2,
});

// For the diamonds and their params.
// Also the update, draw methods.
// Will update and render itself
class Cell {
	x;
	y;

	size = DIAMOND_SIZE; // Default size of the diamond. width = height = 5;
	color = Theme.shapeClr; // Default color. Based on light/dark mode.

	delay = undefined;
	animating = false;

	targetSize = undefined; // For required size during animation.
	targetColor = undefined; // For end point of color change.

	state = state.NORMAL; // For determining if re-rendering is required.

	radius = EFFECT_RADIUS; // Each cell might have different radius.

	// Default size is 5.
	constructor(x, y, size = DIAMOND_SIZE) {
		this.x = x;
		this.y = y;

		this.size = size;
	}

	// Animation loop
	animate() {
		this.animating = true;

		gsap.to(this, {
			size: this.targetSize,
			color: this.targetColor,
			ease: "power2.out",
			duration: 0.5,
			delay: this.delay,
			onComplete: () => {
				this.animating = false;
			},
		});

		this.dynamicRender();
	}

	// For use when animating
	dynamicRender() {
		const offset = this.size / Math.SQRT2;
		const padding = 2;

		ctx.clearRect(
			this.x - offset - padding,
			this.y - offset - padding,
			offset * 2 + padding * 2,
			offset * 2 + padding * 2,
		);

		this.staticRender();
	}

	// Render from center
	staticRender() {
		// Set the style
		ctx.fillStyle = this.color;

		// Calc the offset
		const offset = this.size / Math.SQRT2;

		// Start drawing the diamond
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);

		// Move to the remaining points
		ctx.lineTo(this.x, this.y - offset);
		ctx.lineTo(this.x + offset, this.y);
		ctx.lineTo(this.x, this.y + offset);
		ctx.lineTo(this.x - offset, this.y);
		ctx.lineTo(this.x, this.y - offset);

		// Close the path
		ctx.closePath();

		// Fill the shape
		ctx.fill();
	}
}

// For initiating update sequence and animation changes.
// Will hold the list of cells.
class Grid {
	gridX;
	gridY;

	gapX;
	gapY;

	cells = [];

	// Constructs the grid. Theming will be pulled from the theme class.
	constructor(gX, gY, gaX, gaY) {
		this.gridX = gX;
		this.gridY = gY;

		this.gapX = gaX;
		this.gapY = gaY;

		this.render(DIAMOND_SIZE);
	}

	// Will start animation.
	startAnimation(coords) {
		if (coords === undefined) return;

		if (Pointer.isDown) {
			this.animate(coords, {
				targetSize: CLICK_SIZE,
				targetColor: Theme.clickClr,
				state: state.CLICK,
			});
		} else {
			this.animate(coords, {
				targetSize: HOVER_SIZE,
				targetColor: Theme.hoverClr,
				state: state.HOVER,
			});
		}
	}

	animate(coords, { targetSize, targetColor, state }) {
		// Column
		for (var x = 0; x < this.cells[coords.row].length; ++x) {
			const currCell = this.cells[coords.row][x];

			const delay = Math.abs(x - coords.column) * 0.1;
			currCell.delay = delay;

			currCell.targetSize = targetSize;
			currCell.targetColor = targetColor;
			currCell.state = state;

			currCell.animate();
		}

		// Row
		for (var y = 0; y < this.cells.length; ++y) {
			const currCell = this.cells[y][coords.column];

			const delay = Math.abs(y - coords.row) * 0.1;
			currCell.delay = delay;

			currCell.targetSize = targetSize;
			currCell.targetColor = targetColor;
			currCell.state = state;

			currCell.animate();
		}
	}

	// Initiate render for each cell
	render() {
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
				const cell = new Cell(j, i, DIAMOND_SIZE);
				cell.staticRender();

				row.push(cell);
			}

			this.cells.push(row);
		}
	}

	// Calculates effect radius.
	calcCell() {
		const px = Pointer.x;
		const py = Pointer.y;

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
			return { row, column };
		}
	}
}

// For tracking the theme from 'data-theme' attr.
// Will be used when user clicks dark/light mode button.
class Theme {
	static shapeClr;
	static hoverClr;
	static clickClr;
	static rippleClrs; // For the ripple generated after clicking. Will prolly use a shade of accent color.

	static init() {
		const root = document.documentElement;
		const styles = getComputedStyle(root);

		this.rippleClrs = [];

		for (var i = 1; i <= 9; ++i) {
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

// Will fetch the position of the mouse from 'mousemove'
// Also calculates the row and column.
class Pointer {
	static x = 0;
	static y = 0;

	static isDown = false;

	// Get the pos of the mouse from 'mousemove'
	static init() {
		this.on(["pointermove", "pointerdown", "pointerup"], (e) => {
			this.update(e);
		});
	}

	// Helpers
	static update(e) {
		this.x = e.clientX;
		this.y = e.clientY;

		if (e.type === "pointerdown") {
			this.isDown = true;
		} else if (e.type === "pointerup") {
			this.isDown = false;
		}
	}

	static on(events, callback) {
		events.forEach((e) => {
			window.addEventListener(e, callback);
		});
	}
}

// Resp for orchestration
class App {
	// Main event loop
	static run() {
		const grid = this.init();
		this.loop(grid);
	}

	// Aux functions
	static init() {
		Theme.init();
		Pointer.init();
		const grid = new Grid(GRIDX, GRIDY, GAPX, GAPY);

		return grid;
	}

	static loop(grid) {
		grid.startAnimation(grid.calcCell());
		requestAnimationFrame(() => App.loop(grid));
	}
}

App.run();
