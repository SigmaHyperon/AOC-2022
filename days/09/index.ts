import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { Point2 } from "../../lib/geometry";

enum Direction {
	Up = "U",
	Down = "D",
	Left = "L",
	Right = "R"
}

interface Command {
	direction: Direction;
	amount: number;
}

function parse(line: string): Command {
	const [dir, am] = line.split(" ");
	return {
		direction: dir as Direction,
		amount: parseInt(am)
	};

}

const values = Input.readFile().asLines().removeEmpty().parse(parse).get();

class RopeSegment {
	start: Point2;
	end: Point2;

	history: Set<string>;

	constructor() {
		this.start = new Point2(0, 0);
		this.end = new Point2(0, 0);
		this.history = new Set<string>();
		this.recordHistory();
	}

	pull(x: number, y: number): {x: number, y: number} {
		this.start.x += x;
		this.start.y += y;

		const dx = this.start.x - this.end.x;
		const dy = this.start.y - this.end.y;

		if(Math.max(Math.abs(dx), Math.abs(dy)) > 1) {
			const vx = Math.sign(dx);
			const vy = Math.sign(dy);
			
			this.end.x += vx;
			this.end.y += vy;

			this.recordHistory();

			return {x: vx, y: vy};
		}

		return {x: 0, y: 0};
	}

	private recordHistory(): void {
		this.history.add(`${this.end.x};${this.end.y}`);
	}

}

function part1(): number | string {
	const rope = new RopeSegment();
	for(let command of values) {
		let pull = {x: 0, y: 0};
		if(command.direction === Direction.Up) {
			pull.y = 1;
		} else if(command.direction === Direction.Down) {
			pull.y = -1;
		} else if(command.direction === Direction.Right) {
			pull.x = 1;
		} else {
			pull.x = -1;
		}
		for(let i = 0; i < command.amount; i++) {
			rope.pull(pull.x, pull.y);
		}
	}
	return rope.history.size;
}

class Rope {
	segments: RopeSegment[];

	constructor() {
		this.segments = [];
		for(let i = 0; i < 9; i++) {
			this.segments.push(new RopeSegment());
		}
	}

	pull(x: number, y: number, amount: number): void {
		for(let i = 0; i < amount; i++) {
			const [first, ...following] = this.segments;
			let prev = first.pull(x, y);

			for(let segment of following) {
				prev = segment.pull(prev.x, prev.y);
			}
		}
	}
}

function part2(): number | string {
	const rope = new Rope();
	for(let command of values) {
		let pull = {x: 0, y: 0};
		if(command.direction === Direction.Up) {
			pull.y = 1;
		} else if(command.direction === Direction.Down) {
			pull.y = -1;
		} else if(command.direction === Direction.Right) {
			pull.x = 1;
		} else {
			pull.x = -1;
		}
		rope.pull(pull.x, pull.y, command.amount);
	}
	return rope.segments[rope.segments.length - 1].history.size;
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	