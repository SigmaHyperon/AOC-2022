import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { cp } from "fs";
import Constants from "../../lib/constants";

function isValidCommand(command: string): command is "noop" | "addx" {
	return ["noop", "addx"].includes(command);
}

function parse(line: string): Command {
	const[command, value] = line.split(" ");
	if(isValidCommand(command)) {
		return {
			command: command,
			value: value ? parseInt(value): undefined
		}
	} else {
		throw "invalid command: " + line;
	}
}

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();

interface Command {
	command: "noop" | "addx";
	value?: number;
}

class CPU {
	cycle: number;
	x: number;
	history: number[];
	display: string;

	constructor() {
		this.cycle = 0;
		this.x = 1;
		this.history = [];
		this.display = "";
	}

	execute(command: Command) {
		let cycleCount = command.command === "addx" ? 2 : 1;
		for(let i = 0; i < cycleCount; i++) {
			this.tick();
		}
		if(command.command === "addx" && command.value) {
			this.x += command.value;
		}
	}

	tick() {
		if(Math.abs(this.x - (this.cycle % 40)) <= 1) {
			this.display += Constants.CHAR_FULL_BLOCK;
		} else {
			this.display += " ";
		}
		this.cycle++;
		if(this.cycle % 40 === 0) {
			this.display += "\n";
		}
		if((this.cycle - 20) % 40 === 0) {
			this.history.push(this.cycle * this.x);
		}
	}
}

function part1(): number | string {
	const cpu = new CPU();
	for(let command of values) {
		cpu.execute(command);
	}
	console.log(cpu.display);
	return cpu.history.sum();
}

function part2(): number | string {
	return 0;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	