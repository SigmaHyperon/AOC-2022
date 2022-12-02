import { Input, ListInput } from "../../lib/input";
import Solver from "../../lib/solver";
import "../../lib/prototypes";

enum Action { Rock, Paper, Scissors };

const beatingOrder = [ Action.Rock, Action.Paper, Action.Scissors, Action.Rock, Action.Paper ];

enum Outcome { Win, Loss, Draw };

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

function isOpponentAction(action: string): action is OpponentAction {
	return ["A", "B", "C"].includes(action);
}

function isYourAction(action: string): action is YourAction {
	return ["X", "Y", "Z"].includes(action);
}

function parse(line: string): Turn {
	const [opponentAction, yourAction] = line.split(" ");
	if(isOpponentAction(opponentAction) && isYourAction(yourAction)) {
		return { opponent: opponentAction, you: yourAction }
	} else {
		throw "invalid Action: " + opponentAction + " " + yourAction;
	}
}

const lines = Input.readFile().asLines().removeEmpty().parse(parse);

function determineOutcome(opponentAction: Action, yourAction: Action): Outcome {
	if(opponentAction === yourAction) {
		return Outcome.Draw;
	} else if(yourAction === generateDesiredOutcome(opponentAction, Outcome.Win)) {
		return Outcome.Win;
	} else {
		return Outcome.Loss;
	}
}

function translateTurnToActionsPart1(turn: Turn): Actions {
	return {
		opponent: opponentMap[turn.opponent],
		you: simpleMap[turn.you]
	};
}

function evaluateTurn(actions: Actions): number {
	const outcome = determineOutcome(actions.opponent, actions.you);
	return actionScore.get(actions.you) + outcomeScore.get(outcome);
}

function part1() {
	return lines.get().map(translateTurnToActionsPart1).map(evaluateTurn).sum();
}

function generateDesiredOutcome(opponentAction: Action, desiredOutcome: Outcome): Action {
	const outcomeOrder = [ Outcome.Draw, Outcome.Win, Outcome.Loss ];
	return beatingOrder[(beatingOrder.indexOf(opponentAction) + outcomeOrder.indexOf(desiredOutcome))];
}

function translateTurnToActionsPart2(turn: Turn): Actions {
	return {
		opponent: opponentMap[turn.opponent],
		you: generateDesiredOutcome(opponentMap[turn.opponent], complexMap[turn.you])
	};
}

function part2() {
	return lines.get().map(translateTurnToActionsPart2).map(evaluateTurn).sum();
}

Solver.create()
.setPart1(part1)
.setPart2(part2)
.solve()
