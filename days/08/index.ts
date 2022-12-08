import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Direction } from "../../lib/collections";

const values = Input.readFile().asMatrix("").parse(v => parseInt(v)).asMatrix();


function isVisible(x: number, y: number): boolean {
	return values.isEdge(x,y) || 
		Math.max(...values.rayCast(x, y, Direction.Up)) < values.valueAt(x,y) ||
		Math.max(...values.rayCast(x, y, Direction.Down)) < values.valueAt(x,y) ||
		Math.max(...values.rayCast(x, y, Direction.Left)) < values.valueAt(x,y) ||
		Math.max(...values.rayCast(x, y, Direction.Right)) < values.valueAt(x,y)
}

function part1(): number | string {
	return values.values().filter(v => isVisible(v.x, v.y)).length;
}

function visibleRange(height: number, trees: number[]): number {
	const distance = trees.findIndex(v => v >= height);
	return distance === -1 ? trees.length : distance + 1;
}

function viewingDistance(x: number, y: number): number {
	const height = values.valueAt(x, y);
	return [
		visibleRange(height, values.rayCast(x, y, Direction.Down)), 
		visibleRange(height, values.rayCast(x, y, Direction.Up)), 
		visibleRange(height, values.rayCast(x, y, Direction.Left)), 
		visibleRange(height, values.rayCast(x, y, Direction.Right)) 
	].product();
}

function part2(): number | string {
	return Math.max(...values.values().map(v => viewingDistance(v.x, v.y)));
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	