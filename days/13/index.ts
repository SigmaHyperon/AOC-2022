import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

type Packet = (Packet | number)[];

function parse(lines: string): {left: Packet, right: Packet} {
	const [l, r] = lines.split("\n");
	return {
		left: JSON.parse(l),
		right: JSON.parse(r)
	}
}

const values = Input.readFile().asLines("\n\n").removeEmpty().parse(parse).get();

function isOrderedCorrectly(left: Packet | number, right: Packet | number): boolean | undefined {
	if(typeof left === "number" && typeof right === "number") {
		if(left < right) {
			return true;
		} else if(left > right) {
			return false;
		}
	} else if(Array.isArray(left) && Array.isArray(right)) {
		for(let i = 0; i < Math.max(left.length, right.length); i++) {
			const l = left[i];
			const r = right[i];
			if(typeof l === "undefined" && typeof r !== "undefined") {
				return true;
			} else if(typeof l !== "undefined" && typeof r === "undefined") {
				return false;
			}
			const compare = isOrderedCorrectly(l, r);
			if(typeof compare === "boolean") {
				return compare;
			}
		}
	} else {
		const l = Array.isArray(left) ? left : [left];
		const r = Array.isArray(right) ? right : [right];
		return isOrderedCorrectly(l, r);
	}
}

function part1(): number | string {
	let sum = 0;
	for(let i = 1; i <= values.length; i++) {
		const value = values[i-1];
		if(isOrderedCorrectly(value.left, value.right)) {
			sum += i;
		}
	}
	return sum;
}

const packetList = Input.readFile().asLines().removeEmpty().parse(v => JSON.parse(v)).get() as Packet[];

function part2(): number | string {
	packetList.push([[2]], [[6]]);
	packetList.sort((a, b) => isOrderedCorrectly(a, b) ? -1 : 1);
	const a = packetList.findIndex(v => v.length === 1 && Array.isArray(v[0]) && v[0].length === 1 && v[0][0] === 2) + 1;
	const b = packetList.findIndex(v => v.length === 1 && Array.isArray(v[0]) && v[0].length === 1 && v[0][0] === 6) + 1;
	return a * b;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	