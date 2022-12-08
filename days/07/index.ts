import { Input } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";
import { TreeNode, isNode } from "../../lib/collections";

interface Command {
	type: "command";
	command: "cd" | "ls";
	option?: string;
}

interface Listing {
	type: "directory" | "file";
	name: string;
}

interface Directory extends Listing {
	type: "directory";
}

interface File extends Listing {
	type: "file";
	size: number;
}

const values = Input.readFile().asLines().removeEmpty().get();

function isDirectory(element: any): element is DirectoryNode {
	return typeof element === "object" && "type" in element && element.type === "directory";
}

class DirectoryNode extends TreeNode<number> {
	type = "directory";
	parent: DirectoryNode | null;
	name: string;
	constructor(name: string) {
		super();
		this.name = name;
	}
	size(): number {
		return this.children.map(v => isDirectory(v) ? v.size() : v).sum();
	}
	addChild(node: DirectoryNode | number) {
		if(typeof node !== "number") {
			node.parent = this;
		}
		this.children.push(node);
	}
	listDirectories(): DirectoryNode[] {
		return[this, ...this.children.filter(v => isDirectory(v)).map(v => v as DirectoryNode).flatMap(v => v.listDirectories())];
	}
}

function parseLine(line: string): Command | Directory | File {
	if(line.startsWith("$")) {
		const [, command, option] = line.split(" ");
		if(command === "cd" || command === "ls") {
			return {type: "command", command, option};
		}
		throw "invalid command: " + line;
	} else {
		if(line.startsWith("dir")) {
			const [, name] = line.split(" ");
			return {type: "directory", name};
		} else {
			const [size, name] = line.split(" ");
			return{type: "file", name: name, size: parseInt(size)};
		}
	}
}

function buildTree(lines: string[]): DirectoryNode {
	const root: DirectoryNode = new DirectoryNode("/");
	let current = null;
	for (let line of lines) {
		const thing = parseLine(line);
		if(thing.type === "command") {
			if(thing.command === "cd") {
				if(thing.option === "/") {
					current = root;
				} else if(thing.option === "..") {
					if(current.parent === null) {
						throw "no parent";
					}
					current = current.parent;
				} else if(thing.option) {
					const next = current.children.find(v => v.name === thing.option);
					if(!next) {
						throw "no such directory: " + thing.option;
					}
					current = next;
				} else {
					throw "invalid command: " + JSON.stringify(thing);
				}
			}
		} else if(thing.type === "directory") {
			current.addChild(new DirectoryNode(thing.name));
		} else if(thing.type === "file") {
			current.addChild(thing.size);
		}
	}
	return root;
}

function part1(): number | string {
	const tree = buildTree(values);
	return tree.listDirectories().map(v => v.size()).filter(v => v <= 100000).sum();
}

function part2(): number | string {
	const tree = buildTree(values);
	const total = 70000000;
	const requiredFree = 30000000;
	const missing = requiredFree - (total - tree.size());
	return Math.min(...tree.listDirectories().map(v => v.size()).filter (v => v >= missing));
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve();
	