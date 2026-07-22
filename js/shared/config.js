export const Config = {
	grid: {
		margin: {
			top: 40,
			left: 40,
			bottom: 40,
			right: 40,
		},

		gap: {
			column: 20,
			row: 20,
		},
	},

	cell: {
		size: 2,

		state: {
			normal: {
				id: 0,
				scale: 1,
				get size() {
					return Config.cell.size * this.scale;
				},
			},

			hover: {
				id: 1,
				scale: 6,
				get size() {
					return Config.cell.size * this.scale;
				},
			},

			click: {
				id: 2,
				scale: 6.2,
				get size() {
					return Config.cell.size * this.scale;
				},
			},
		},

		effect: {
			scale: 10.25,
			get radius() {
				return Config.cell.size * this.scale;
			},
			steps: 3,
			limit: 3,
		},
	},

	animation: {
		duration: 0.3,

		hover: {
			delay: 0.003,
		},

		click: {
			delay: 0.2,
		},
	},

	wave: {
		speed: 60.5,

		amplitude: 1,
		frequency: 1,
		wavelength: 1,

		width: {
			crest: 20,
			ring: 40,
		},

		delay: {
			peak: 1,
		},

		damping: 0.1,
	},
};
