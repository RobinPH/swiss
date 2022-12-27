import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
import fs from "node:fs";
import {
  IDENTIFIER,
  CONST_DECLARATOR,
  DECLARATION_STATEMENT,
  DECLARATOR,
} from "../terminal";
import FiniteAutomata from "..";
const { ATOM, STAR } = FiniteAutomata;

let viz = new Viz({ Module, render });

let index = 0;

const generateVizString = (machine: FiniteAutomata<any, any, any>) => {
  const machineIndexMapping = new Map<FiniteAutomata<any, any, any>, number>();

  const getLabel = (machine: FiniteAutomata<any, any, any>) => {
    if (!machineIndexMapping.has(machine)) {
      machineIndexMapping.set(machine, ++index);
    }

    return machineIndexMapping.get(machine)!;
  };

  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

  const groupColor = new Map<FiniteAutomata<any, any, any>, string>();

  const done = new Set<FiniteAutomata<any, any, any>>();
  const data = new Array<string>();

  const generate = (m: FiniteAutomata<any, any, any>) => {
    done.add(m);

    const attributes = new Array<string>();

    if (m.isFinal) {
      attributes.push(`shape = doublecircle`);
    }

    if (!groupColor.has(m.start)) {
      groupColor.set(m.start, randomColor());
    }
    // attributes.push(`color = "#${groupColor.get(m.start)}"`);

    attributes;
    data.push(`node [${attributes.join(" ")}]; ${getLabel(m)};`);

    for (const [symbol, children] of m.transitions) {
      for (const child of children) {
        const s = symbol === FiniteAutomata.EPSILON ? "ε" : symbol;
        data.push(`${getLabel(m)} -> ${getLabel(child)} [ label="${s}" ]`);

        if (!done.has(child)) {
          generate(child);
        }
      }
    }
  };

  generate(machine);
  data.push(`node [shape = point ]; qi`, `qi -> ${getLabel(machine)}`);

  return `digraph { ${data.join(" ")} }`;
};

const A = ATOM("A").setValue("A");

viz
  .renderString(generateVizString(DECLARATOR))
  .then((result) => {
    fs.writeFileSync("./build/test.svg", result);
  })
  .catch((error) => {
    viz = new Viz({ Module, render });

    console.error(error);
  });
