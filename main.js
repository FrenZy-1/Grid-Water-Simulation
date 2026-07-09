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
const DIAMOND_SIZE = 8;
const EFFECT_RADIUS = DIAMOND_SIZE * 2;
const EFFECT_LIMIT = 3;

const HOVER_SIZE = DIAMOND_SIZE * 2;
const CLICK_SIZE = HOVER_SIZE + 6;
const STEPS = 3;

const GRIDX = 58;
const GRIDY = 50;

const GAPX = 35;
const GAPY = 35;

const ANIMATION_DURATION = 0.2;
const PROPAGATION_SPEED = 0.09;
const PULSE_SPEED = 0.3;

// Enums
const cellState = Object.freeze({
	NORMAL: 0,
	HOVER: 1,
	CLICK: 2,
});

// For tracking the theme from 'data-theme' attr.
// Will be used when user clicks dark/light mode button.
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

// Will fetch the position of the mouse from 'mousemove'
// Also calculates the row and column.
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

	// Get the pos of the mouse from 'mousemove'
	static init(grid) {
		window.addEventListener("pointermove", (e) => {
			this.updatePrev(this.curr.x, this.curr.y);
			this.update(e);

			const coords = grid.calcCell(this.curr.x, this.curr.y);
			const prevCoords = grid.calcCell(this.prev.x, this.prev.y);

			if (
				coords === undefined ||
				prevCoords === undefined ||
				prevCoords.column !== coords.column ||
				prevCoords.row !== coords.row
			)
				grid.animate(prevCoords, cellState.NORMAL);

			if (this.isDown) {
				grid.animate(coords, cellState.CLICK);
			} else {
				grid.animate(coords, cellState.HOVER);
			}
		});

		window.addEventListener("pointerdown", (e) => {
			this.update(e);
			this.isDown = true;

			grid.animate(
				grid.calcCell(this.curr.x, this.curr.y),
				cellState.CLICK,
			);
		});

		window.addEventListener("pointerup", (e) => {
			this.updatePrev(this.curr.x, this.curr.y);
			this.update(e);
			this.isDown = false;

			const coords = grid.calcCell(this.curr.x, this.curr.y);
			const prevCoords = grid.calcCell(this.prev.x, this.prev.y);

			if (
				coords === undefined ||
				prevCoords === undefined ||
				prevCoords.column !== coords.column ||
				prevCoords.row !== coords.row
			)
				grid.animate(prevCoords, cellState.NORMAL);

			grid.animate(coords, cellState.HOVER);
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

// For the diamonds and their params.
// Also the update, draw methods.
// Will update and render itself
class Cell {
	x;
	y;

	size = DIAMOND_SIZE; // Default size of the diamond. width = height = 5;
	color = Theme.shapeClr; // Default color. Based on light/dark mode.

	delay = undefined;

	targetSize = undefined; // For required size during animation.
	targetColor = undefined; // For end point of color change.

	selfState = cellState.NORMAL; // For determining if re-rendering is required.

	radius = EFFECT_RADIUS; // Each cell might have different radius.

	// Default size is 5.
	constructor(x, y, size = DIAMOND_SIZE) {
		this.x = x;
		this.y = y;

		this.size = size;
	}

	// Animation loop
	animate(onComplete) {
		gsap.killTweensOf(this);

		gsap.to(this, {
			size: this.targetSize,
			color: this.targetColor,
			ease: "power2.out",
			duration: ANIMATION_DURATION,
			delay: this.delay,
			onComplete,
		});
	}

	// For use when animating
	dynamicRender() {
		const offset = this.size / Math.SQRT2;
		const padding = 4;

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
	static dirtyCells = [];

	// Constructs the grid. Theming will be pulled from the theme class.
	constructor(gX, gY, gaX, gaY) {
		this.gridX = gX;
		this.gridY = gY;

		this.gapX = gaX;
		this.gapY = gaY;

		this.render(DIAMOND_SIZE);
	}

	// Sets delays based on distance.
	animate(coords, state) {
		if (coords === undefined) return;

		const tokens = this.lookupValues(state);
		if (tokens === undefined) return;

		// Column
		for (var x = 0; x < this.cells[coords.row].length; ++x) {
			const currCell = this.cells[coords.row][x];

			const dist = Math.abs(x - coords.column);
			if (dist > EFFECT_LIMIT) continue;

			currCell.delay = dist * PROPAGATION_SPEED;

			currCell.targetSize =
				state === cellState.NORMAL
					? tokens.size
					: tokens.size - dist * STEPS <= DIAMOND_SIZE
						? DIAMOND_SIZE
						: state === cellState.CLICK
							? tokens.size - dist * (STEPS + 1)
							: tokens.size - dist * STEPS;
			currCell.targetColor =
				state === cellState.NORMAL
					? tokens.color
					: tokens.color[tokens.color.length - 1 - dist];

			if (currCell.selfState !== state) {
				currCell.selfState = state;
				Grid.dirtyCells.push(currCell);
				currCell.animate(() => {
					Grid.dirtyCells = Grid.dirtyCells.filter(
						(c) => c !== currCell,
					);
				});
			}
		}

		// Row
		for (var y = 0; y < this.cells.length; ++y) {
			const currCell = this.cells[y][coords.column];

			const dist = Math.abs(y - coords.row);
			if (dist > EFFECT_LIMIT) continue;

			currCell.delay = dist * PROPAGATION_SPEED;

			currCell.targetSize =
				state === cellState.NORMAL
					? tokens.size
					: tokens.size - dist * STEPS <= DIAMOND_SIZE
						? DIAMOND_SIZE
						: state === cellState.CLICK
							? tokens.size - dist * (STEPS + 1)
							: tokens.size - dist * STEPS;
			currCell.targetColor =
				state === cellState.NORMAL
					? tokens.color
					: tokens.color[tokens.color.length - 1 - dist];

			if (currCell.selfState !== state) {
				currCell.selfState = state;
				Grid.dirtyCells.push(currCell);
				currCell.animate(() => {
					Grid.dirtyCells = Grid.dirtyCells.filter(
						(c) => c !== currCell,
					);
				});
			}
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
	calcCell(px, py) {
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
			return { column, row };
		}
	}

	// State based lookup
	lookupValues(currState) {
		switch (currState) {
			case cellState.CLICK:
				return { size: CLICK_SIZE, color: Theme.rippleClrs };
			case cellState.HOVER:
				return { size: HOVER_SIZE, color: Theme.rippleClrs };
			case cellState.NORMAL:
				return { size: DIAMOND_SIZE, color: [Theme.shapeClr] };
			default:
				return undefined;
		}
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
		const grid = new Grid(GRIDX, GRIDY, GAPX, GAPY);
		Pointer.init(grid);

		return grid;
	}

	static loop(grid) {
		Grid.dirtyCells.forEach((cell) => {
			cell.dynamicRender();
		});

		requestAnimationFrame(() => App.loop(grid));
	}
}

App.run();
