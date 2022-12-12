import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Matrix, MatrixValue } from "../../lib/collections";

interface Tile {
	height: number;
	feature?: "S" | "E";
	visited?: boolean;
	step?: number;
}

function parse(tile: string): Tile {
	const height = tile.replace("S", "a").replace("E", "z").toLowerCase().charCodeAt(0) - 97;
	const feature = ["S", "E"].includes(tile) ? tile as "S" | "E" : undefined;
	return {height, feature};
}

const values = Input.readFile().asMatrix("");

function getMap(): Matrix<Tile> {
	return values.parse(parse).asMatrix()
}

function getDistance(map: Matrix<Tile>, x1: number, y1: number, x2: number, y2: number): number {
	const start = map.matrixValueAt(x1, y1);
	start.value.visited = true;
	const end = map.valueAt(x2, y2);
	let steps = 0;
	let previous: MatrixValue<Tile>[] = [start];
	while(end.visited !== true) {
		const current: MatrixValue<Tile>[] = [];
		if(previous.length === 0) {
			return Infinity;
		}
		for(let tile of previous) {
			const neighbors = map.neighbours(tile.x, tile.y).filter(v => v.value.visited !== true).filter(v => v.value.height <= (tile.value.height + 1));
			neighbors.forEach(v => v.value.visited = true);
			neighbors.forEach(v => v.value.step = steps);
			current.push(...neighbors);
		}
		previous = current;
		steps++;
	}
	return steps;
}

function part1(): number | string {
	const map = getMap();
	const start = map.values().find(v => v.value.feature === "S");
	const end = map.values().find(v => v.value.feature === "E");
	return getDistance(map, start.x, start.y, end.x, end.y);
}



function part2(): number | string {
	const lowPoints = getMap().values().filter(v => v.value.height === 0);
	const end = getMap().values().find(v => v.value.feature === "E");
	let distances: number[] = [];
	for(let start of lowPoints) {
		const map = getMap();
		distances.push(getDistance(map, start.x, start.y, end.x, end.y));
	}
	return Math.min(...distances);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	