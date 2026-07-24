import { Config } from "../shared/config.js";

class WaveEngine {
	static waveBuffer;
	static sampleTarget = Object.freeze({
		HEIGHT: 0,
		LAP: 1,
	});

	static init(columns, rows) {
		this.waveBuffer = [];

		const centerR = Math.floor(rows / 2);
		const centerC = Math.floor(columns / 2);
		const maxDist = Math.sqrt(centerR ** 2 + centerC ** 2);

		for (var r = 0; r < rows; ++r) {
			var bufferRow = [];
			for (var c = 0; c < columns; ++c) {
				const bufferCell = {
					height: 0,
					velocity: 0,
					depth: 0,
					spreadForce: 0,
					lap: 0,
				};

				const dist = Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2);
				bufferCell.depth = Math.max(
					Math.pow(1 - dist / maxDist, Config.wave.depth.falloff),
					Config.wave.depth.min,
				);

				bufferRow.push(bufferCell);
			}

			this.waveBuffer.push(bufferRow);
		}
	}

	static update() {
		this.waveBuffer.forEach((row, r) => {
			row.forEach((cell, c) => {
				cell.lap = this.averageSample(c, r, this.sampleTarget.HEIGHT);
			});
		});

		this.waveBuffer.forEach((row, r) => {
			row.forEach((cell, c) => {
				const lap2 = this.averageSample(c, r, this.sampleTarget.LAP);
				cell.spreadForce =
					cell.lap * Config.wave.spread * cell.depth -
					lap2 * Config.wave.dispersion;
			});
		});

		this.waveBuffer.forEach((row) => {
			row.forEach((cell) => {
				cell.velocity +=
					cell.spreadForce + -cell.height * Config.wave.spring;
				cell.height += cell.velocity;
				cell.velocity *= Config.wave.damping;
			});
		});
	}

	static inject(c, r, dist, force) {
		const sigma = Config.wave.effect.radius / 2;
		const f = Math.exp(-(dist * dist) / (2 * sigma * sigma)) * force;
		this.waveBuffer[r]?.[c] && (this.waveBuffer[r][c].velocity += f);
	}

	static averageSample(c, r, valueId) {
		var sum = 0;
		var weight = 0;

		for (var row = -1; row < 2; ++row) {
			for (var col = -1; col < 2; ++col) {
				const currCell = this.waveBuffer[r + row]?.[c + col];
				if (row === 0 && col === 0) continue;

				const tempW = col !== 0 && row !== 0 ? 0.707 : 1;

				sum += this.sampleNeighbour(
					valueId === this.sampleTarget.HEIGHT
						? currCell?.height
						: currCell?.lap,
					tempW,
				);
				weight += tempW;
			}
		}

		return (
			sum / weight -
			(valueId === this.sampleTarget.HEIGHT
				? this.waveBuffer[r][c]?.height
				: this.waveBuffer[r][c]?.lap)
		);
	}

	static sampleNeighbour(value, weight) {
		return (value ?? 0) * weight;
	}
}

export { WaveEngine };
