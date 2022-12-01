import { Input, ListInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

const values: ListInput<number | null> = Input.readFile().asLines().parse((v): number | null => {
	if(v.length > 0) {
		return parseInt(v);
	} else {
		return null;
	}
});

function carryWeight(): number[] {
	const list = [];
	let index = 0;
	
	for(let value of values.content) {
		if(value != null) {
			if(!list[index]) {
				list[index] = 0;
			}
			list[index] = list[index] + value;
		} else {
			index++;
		}
	}
	return list;
}

function part1() {
	return Math.max(...carryWeight());
}

function part2() {
	return carryWeight().sort((a,b) => b - a).slice(0, 3).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve()
