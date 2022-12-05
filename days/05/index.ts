import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

export type State = string[][]

enum CraneType {
	CrateMover_9000,
	CrateMover_9001
}

interface MoveOrder {
	count: number;
	from: number;
	to: number;
}

function parseState(lines: string[]): State {
	const count = parseInt(lines.splice(lines.length - 1, 1)[0].split(" ").filter(v => v.length > 0).pop());
	const state = Array(count);
	for(let line of lines) {
		for(let i = 1; i < line.length; i += 4){
			if(line[i] !== " ") {
				if(!Array.isArray(state[(i - 1) / 4])) {
					state[(i - 1) / 4] = [];
				}
				state[(i - 1) / 4].unshift(line[i]);
			}
		}
	}
	return state;
}

function parseInstructions(lines: string[]): MoveOrder[] {
	return lines.filter(v => v.length > 0).map(v => v.match(/move (\d+) from (\d+) to (\d+)/)).map(v => {
		return {
			count: parseInt(v[1]),
			from: parseInt(v[2]),
			to: parseInt(v[3])
		}
	});
}

const values = Input.readFile().asLines().get();

function parse(lines: string[]): {state: State; instructions: MoveOrder[]} {
	const splitIndex = lines.indexOf("");
	const stateDefinition = lines.slice(0, splitIndex);
	const instructionDefinition = lines.slice(splitIndex + 1);
	return {
		state: parseState(stateDefinition),
		instructions: parseInstructions(instructionDefinition)
	};
}

function executeMoveOrder(state: State, moveOrder: MoveOrder, craneType: CraneType) {
	const stackSize = state[moveOrder.from - 1].length;
	let pickup = state[moveOrder.from - 1].splice(stackSize - moveOrder.count, moveOrder.count);
	if(craneType === CraneType.CrateMover_9000) {
		pickup = pickup.reverse()
	}
	state[moveOrder.to - 1].push(...pickup);
}

function part1(): number | string {
	const data = parse(values);
	for(let order of data.instructions) {
		executeMoveOrder(data.state, order, CraneType.CrateMover_9000);
	}
	return data.state.map(v => v[v.length - 1]).join("");
}

function part2(): number | string {
	const data = parse(values);
	for(let order of data.instructions) {
		executeMoveOrder(data.state, order, CraneType.CrateMover_9001);
	}
	return data.state.map(v => v[v.length - 1]).join("");
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	