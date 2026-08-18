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
		maxHeight: 2,
	},

	wave: {
		spring: 0.0253, // Higher: wave dies down faster
		damping: 0.962, // Higher: Less energy lost
		spread: 0.5,
		dispersion: 0.003,
		force: {
			hover: 2.5,
			click: 14,
		},
		effect: {
			scale: 8,
			get radius() {
				return Config.cell.size * this.scale;
			},
		},
		depth: {
			min: 0.2,
			falloff: 0.05,
		},
	},

	random: {
		click: {
			chance: 0.9779,
		},
		hover: {
			chance: 0.9985,
		},
	},
};
