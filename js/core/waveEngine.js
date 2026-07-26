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
		const maxDist = Math.max(0.1, Math.sqrt(centerR ** 2 + centerC ** 2));

		for (let r = 0; r < rows; ++r) {
			let waveBufferRow = [];
			for (let c = 0; c < columns; ++c) {
				const waveBufferCell = {
					height: 0,
					velocity: 0,
					depth: 0,
					spreadForce: 0,
					lap: 0,
				};

				const dist = Math.sqrt((r - centerR) ** 2 + (c - centerC) ** 2);
				waveBufferCell.depth = Math.max(
					Math.pow(1 - dist / maxDist, Config.wave.depth.falloff),
					Config.wave.depth.min,
				);

				waveBufferRow.push(waveBufferCell);
			}

			this.waveBuffer.push(waveBufferRow);
		}
	}

	static update() {
		this.waveBuffer.forEach((row, r) => {
			row.forEach((cell, c) => {
				cell.lap = this.laplacian(c, r, this.sampleTarget.HEIGHT);
			});
		});

		this.waveBuffer.forEach((row, r) => {
			row.forEach((cell, c) => {
				const lap2 = this.laplacian(c, r, this.sampleTarget.LAP);
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
		const gaussianForce =
			Math.exp(-(dist * dist) / (2 * sigma * sigma)) * force;
		const cell = this.waveBuffer[r]?.[c];

		if (cell) {
			cell.velocity += gaussianForce;
		}
	}

	static laplacian(c, r, fieldType) {
		let sum = 0;
		let weight = 0;
		const key = fieldType === this.sampleTarget.HEIGHT ? "height" : "lap";

		for (let dr = -1; dr < 2; ++dr) {
			for (let dc = -1; dc < 2; ++dc) {
				const currCell = this.waveBuffer[r + dr]?.[c + dc];
				if (dr === 0 && dc === 0) continue;

				const neighbourWeight = dc !== 0 && dr !== 0 ? 0.707 : 1;

				sum += (currCell?.[key] ?? 0) * neighbourWeight;
				weight += neighbourWeight;
			}
		}

		return sum / weight - this.waveBuffer[r][c][key];
	}
}

export { WaveEngine };
