import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const values = Input.readFile().get().replace("\n", "");

function isAllUnique(chars: string): boolean {
	const _ = new Set<string>();
	for(let char of chars) {
		_.add(char);
	}
	return _.size === chars.length;
}

function findEndOfUniqueSquence(text: string, length: number): number {
	for(let i = length; i < text.length; i++) {
		if(isAllUnique(text.substring(i - length, i))) {
			return i;
		}
	}
	throw "no unique sequence of length " + length + " found";
}

function part1(): number | string {
	return findEndOfUniqueSquence(values, 4);
}

function part2(): number | string {
	return findEndOfUniqueSquence(values, 14);
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	