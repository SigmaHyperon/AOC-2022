import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists } from "../../lib/collections";

enum TileType {
	Air,
	Wall,
	Sand
}

interface Tile {
	x: number;
	y: number;
	type: TileType;
}

class SandSystem {
	tiles: Map<string, Tile>;
	maxY: number;
	floor: boolean;

	constructor(floor = false) {
		this.tiles = new Map<string, Tile>();
		this.maxY = 0;
		this.floor = floor;
	}

	addTile(x: number, y: number, type: TileType): void {
		if(this.tiles.has(this.coordinateString(x, y))) {
			if(type === TileType.Sand) {
				throw `tile collision: ${x} ${y}`;
			} else {
				return;
			}
		} else {
			const tile = {x, y, type};
			this.tiles.set(this.coordinateString(x, y), tile);
			if(type === TileType.Wall) {
				this.maxY = Math.max(this.maxY, y);
			}
		}
	}

	addWall(x1: number, y1: number, x2: number, y2: number): void {
		if(x1 !== x2 && y1 !== y2) {
			throw "wall is not horizontal/vertical";
		}
		if(x1 !== x2) {
			const a = Math.min(x1, x2);
			const b = Math.max(x1, x2);
			for(let i = a; i <= b; i++) {
				this.addTile(i, y1, TileType.Wall);
			}
		} else {
			const a = Math.min(y1, y2);
			const b = Math.max(y1, y2);
			for(let i = a; i <= b; i++) {
				this.addTile(x1, i, TileType.Wall);
			}
		}
	}

	addSand(x: number, y: number): boolean {
		while(y < this.maxY || this.floor) {
			if(!this.isBlocked(x, y + 1)) {
				y++;
			} else if(!this.isBlocked(x - 1, y + 1)) {
				x--;
				y++;
			} else if(!this.isBlocked(x + 1, y + 1)) {
				x++;
				y++;
			} else {
				this.addTile(x, y, TileType.Sand);
				return false;
			}
		}
		return true;
	}

	isBlocked(x: number, y: number) : boolean {
		if(this.floor === true && (y === (2 + this.maxY))) {
			return true;
		}
		return this.tiles.has(this.coordinateString(x, y));
	}

	private coordinateString(x: number, y: number): string {
		return `${x};${y}`;
	}
}

function parse(line: string): {x: number, y: number}[] {
	const points = line.split(" -> ");
	return points.map(v => {
		const [x,y] = v.split(",").map(k => parseInt(k));
		return {x,y};
	});
}

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();
// const values = Input.import(`498,4 -> 498,6 -> 496,6
// 503,4 -> 502,4 -> 502,9 -> 494,9`).asLines().removeEmpty().parse(parse).get();

function part1(): number | string {
	const system = new SandSystem();
	for(let line of values) {
		for(let i = 0; i < line.length - 1; i++) {
			const pair = Lists.window(line, i, 2);
			system.addWall(pair[0].x, pair[0].y, pair[1].x, pair[1].y);
		}
	}
	let full = false;
	while(full == false) {
		full = system.addSand(500, 0);
	}
	return [...system.tiles.values()].filter(v => v.type === TileType.Sand).length;
}

function part2(): number | string {
	const system = new SandSystem(true);
	for(let line of values) {
		for(let i = 0; i < line.length - 1; i++) {
			const pair = Lists.window(line, i, 2);
			system.addWall(pair[0].x, pair[0].y, pair[1].x, pair[1].y);
		}
	}
	try {
		while(true) {
			system.addSand(500, 0);
		}
	} catch(e) {

	}
	return [...system.tiles.values()].filter(v => v.type === TileType.Sand).length;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	