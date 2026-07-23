export const Config = {
	grid: {
		margin: {
			top: 20,
			left: 20,
			bottom: 20,
			right: 20,
		},
		gap: {
			column: 15,
			row: 15,
		},
	},

	cell: {
		size: 2,
		maxHeight: 1,
	},

	wave: {
		spring: 0.035, // Higher: wave dies down faster
		damping: 0.951, // Higher: Less energy lost
		spread: 0.3,
		force: {
			hover: 3,
			click: 16,
		},
		effect: {
			scale: 12,
			get radius() {
				return Config.cell.size * this.scale;
			},
		},
	},
};
