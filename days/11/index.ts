import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

class Monkey {
	id: number;
	items: number[];
	operation: {
		a: string | number;
		operand: "+" | "*";
		b: string | number;
	}
	actions: {
		divisible: number;
		positive: number;
		negative: number;
	}
	interactions: number;

	constructor() {
		this.interactions = 0;
	}

	inspect(copium?: number): {item: number; target: number} {
		let item = this.items.shift();
		const a = this.operation.a === "old" ? item : this.operation.a as number;
		const b = this.operation.b === "old" ? item : this.operation.b as number;
		item = this.operation.operand === "*" ? a * b : a + b;
		if(!copium) {
			item = Math.floor(item / 3);
		} else {
			item = item % copium;
		}
		const target = item % this.actions.divisible === 0 ? this.actions.positive : this.actions.negative;
		this.interactions++;
		return { item, target };
	}

	turn(copium?: number): {item: number; target: number}[] {
		const res = [];
		while(this.items.length > 0) {
			res.push(this.inspect(copium));
		}
		return res;
	}
}

function parse(definition: string): Monkey {
	const [idLine, startingItems, operation, test, positive, negative] = definition.split("\n");
	const id = parseInt(idLine.split(" ")[1].replace(":", ""));
	const items = startingItems.split(":")[1].replace(" ", "").split(",").map(v => parseInt(v));
	const [, , , a, operand, b] = operation.split(":")[1].split(" ");
	const divisible = parseInt(test.split(" ").slice(-1)[0]);
	const pos = parseInt(positive.split(" ").slice(-1)[0])
	const neg = parseInt(negative.split(" ").slice(-1)[0]);

	const monke = new Monkey();
	monke.id = id;
	monke.items = items;
	monke.operation = {
		a: a === "old" ? a : parseInt(a),
		operand: operand as any,
		b: b === "old" ? b : parseInt(b)
	}
	monke.actions = {
		divisible,
		positive: pos,
		negative: neg
	}
	return monke;
}

const values = Input.readFile().asLines("\n\n").removeEmpty().parse(parse).get();

function part1(): number | string {
	for(let i = 0; i < 20; i++) {
		for(let monke of values) {
			const thrown = monke.turn();
			for(let item of thrown) {
				const target = values.find(v => v.id === item.target);
				target.items.push(item.item);
			}
		}
	}
	return values.map(v => v.interactions).sort((a, b) => a - b).slice(-2).product();
}

const values2 = Input.readFile().asLines("\n\n").removeEmpty().parse(parse).get();

function part2(): number | string {
	const copium = values2.map(v => v.actions.divisible).product();
	for(let i = 0; i < 10000; i++) {
		for(let monke of values2) {
			const thrown = monke.turn(copium);
			for(let item of thrown) {
				const target = values2.find(v => v.id === item.target);
				target.items.push(item.item);
			}
		}
	}
	return values2.map(v => v.interactions).sort((a, b) => a - b).slice(-2).product();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	