import { Config } from "../shared/config.js";

class WaveEngine {
	static waveBuffer = [];

	static init(columns, rows) {
		this.waveBuffer = Array.from({ length: rows }, () =>
			Array.from({ length: columns }, () => ({
				height: 0,
				velocity: 0,
			})),
		);
	}

	static update() {
		this.waveBuffer.forEach((row, r) => {
			row.forEach((cell, c) => {
				const avg = this.averageHeight(c, r);

				cell.velocity += (avg - cell.height) * Config.wave.spread;
			});
		});

		this.waveBuffer.forEach((row) => {
			row.forEach((cell) => {
				cell.velocity += -cell.height * Config.wave.spring;
				cell.height += cell.velocity;
				cell.velocity *= Config.wave.damping;
			});
		});
	}

	static inject(column, row, force) {
		this.waveBuffer[row][column].velocity += force;
	}

	static averageHeight(c, r) {
		var sum = 0;
		var weight = 0;

		for (var row = -1; row < 2; ++row) {
			for (var col = -1; col < 2; ++col) {
				const currCell = this.waveBuffer[r + row]?.[c + col];
				const tempW = col !== 0 && row !== 0 ? 0.707 : 1;

				sum += this.sampleNeighbour(currCell, tempW);
				weight += tempW;
			}
		}

		return sum / weight;
	}

	static sampleNeighbour(cell, weight) {
		if (!cell) return 0;
		return cell.height * weight;
	}
}

export { WaveEngine };
