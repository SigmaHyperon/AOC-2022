import { Input, ListInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

enum Action {
	Rock,
	Paper,
	Scissors
}

enum Outcome {
	Win,
	Loss,
	Draw
}

type OpponentAction = "A" | "B" | "C";
type YourAction = "X" | "Y" | "Z";

interface Turn {
	opponent: OpponentAction;
	you: YourAction;
}

interface Actions {
	opponent: Action;
	you: Action;
}

interface Result {
	played: Action;
	outcome: Outcome;
	score: number;
}

const opponentMap = {
	A: Action.Rock,
	B: Action.Paper,
	C: Action.Scissors
}

const simpleMap = {
	X: Action.Rock,
	Y: Action.Paper,
	Z: Action.Scissors
}

const complexMap = {
	X: Outcome.Loss,
	Y: Outcome.Draw,
	Z: Outcome.Win
}

const actionScore = new Map<Action, number>();
actionScore.set(Action.Rock, 1);
actionScore.set(Action.Paper, 2);
actionScore.set(Action.Scissors, 3);

const outcomeScore = new Map<Outcome, number>();
outcomeScore.set(Outcome.Win, 6);
outcomeScore.set(Outcome.Draw, 3);
outcomeScore.set(Outcome.Loss, 0);

function validateOpponentAction(action: string): action is OpponentAction {
	return ["A", "B", "C"].includes(action);
}

function validateYourAction(action: string): action is YourAction {
	return ["X", "Y", "Z"].includes(action);
}

function parse(line: string): Turn {
	const _ = line.split(" ");
	const opponentAction = _[0];
	const yourAction = _[1];
	if(validateOpponentAction(opponentAction) && validateYourAction(yourAction)) {
		return {
			opponent: opponentAction,
			you: yourAction
		}
	} else {
		throw "invalid Action: " + opponentAction + " " + yourAction;
	}
}


// const lines = Input.import(`A Y
// B X
// C Z`).asLines().removeEmpty().parse(parse);
const lines = Input.readFile().asLines().removeEmpty().parse(parse);

function determineOutcome(opponentAction: Action, yourAction: Action): Outcome {
	if(opponentAction === yourAction) {
		return Outcome.Draw;
	} else {
		if(yourAction === Action.Rock && opponentAction === Action.Scissors || yourAction === Action.Paper && opponentAction === Action.Rock || yourAction === Action.Scissors && opponentAction === Action.Paper) {
			return Outcome.Win
		} else {
			return Outcome.Loss;
		}
	}
}

function simpleActions(turn: Turn): Actions {
	return {
		opponent: opponentMap[turn.opponent],
		you: simpleMap[turn.you]
	};
}

function evaluateTurn(actions: Actions): Result {
	const outcome = determineOutcome(actions.opponent, actions.you);
	const _actionScore = actionScore.get(actions.you);
	const _outcomeScore = outcomeScore.get(outcome);
	return {
		played: actions.you,
		outcome: outcome,
		score: _actionScore + _outcomeScore
	};
}

function part1() {
	return lines.get().map(v => evaluateTurn(simpleActions(v)).score).sum();
}

function generateDesiredOutcome(opponentAction: Action, desiredOutcome: Outcome): Action {
	if(desiredOutcome === Outcome.Draw) {
		return opponentAction;
	} else {
		if(desiredOutcome === Outcome.Win) {
			if(opponentAction === Action.Rock) {
				return Action.Paper;
			} else if(opponentAction === Action.Paper) {
				return Action.Scissors;
			} else {
				return Action.Rock;
			}
		} else {
			if(opponentAction === Action.Rock) {
				return Action.Scissors;
			} else if(opponentAction === Action.Paper) {
				return Action.Rock;
			} else {
				return Action.Paper;
			}
		}
	}
}

function complexActions(turn: Turn): Actions {
	return {
		opponent: opponentMap[turn.opponent],
		you: generateDesiredOutcome(opponentMap[turn.opponent], complexMap[turn.you])
	};
}

function part2() {
	return lines.get().map(v => evaluateTurn(complexActions(v)).score).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve()
