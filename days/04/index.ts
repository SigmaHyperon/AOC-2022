import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

interface Range {
	a: number;
	b: number;
}

interface Pair {
	left: Range;
	right: Range;
}

function parseRange(range: string): Range {
	const [a,b] = range.split("-").map(v => parseInt(v));
	return {a, b};
}

function parse(line: string): Pair {
	const [left, right] = line.split(",").map(parseRange);
	return {left, right}
}

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();

function part1(): number | string {
	return values.filter( v => v.left.a <= v.right.a && v.left.b >= v.right.b || v.left.a >= v.right.a && v.left.b <= v.right.b).length;
}

function part2(): number | string {
	return values.filter( v => v.left.a <= v.right.a && v.left.b >= v.right.a || v.left.a <= v.right.b && v.left.b >= v.right.b || v.right.a <= v.left.a && v.right.b >= v.left.a || v.right.a <= v.left.b && v.right.b >= v.left.b).length;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	