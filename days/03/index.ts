import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Lists } from "../../lib/collections";

const values = Input.readFile().asLines().removeEmpty().get();

function getCommonItem(line: string): string {
	for(let char of line.slice(0, line.length / 2)) {
		if(line.slice(line.length/2).includes(char)) {
			return char;
		}
	}
	throw "no common item";
}

function scoreItem(item: string): number {
	const code = item.charCodeAt(0);
	if(code >= 97) {
		return code - 96;
	}
	return code - 38;
}

function part1(): number | string {
	return values.map(getCommonItem).map(scoreItem).sum();
}

function getCommonItemInGroup(group: string[]): string {
	for(let char of group[0]) {
		if(group[1].includes(char) && group[2].includes(char)) {
			return char;
		}
	}
	throw "no common item";
}

function part2(): number | string {
	return Lists.group(values, 3).map(getCommonItemInGroup).map(scoreItem).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	