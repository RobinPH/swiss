import fs from "node:fs";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
import { FiniteStateMachine } from "..";

let viz = new Viz({ Module, render });

export const vizRender = (filepath: string, input: string) => {
  viz
    .renderString(input)
    .then((result) => {
      fs.writeFileSync(`${filepath}.svg`, result);
      console.log(`FSM Drawing saved at ${filepath}`);
    })
    .catch((error) => {
      viz = new Viz({ Module, render });

      console.error(error);
    });
};

export const vizualize = (name: string, machine: FiniteStateMachine) => {
  let index = 0;

  const nodes = new Array<string>();
  const transitions = new Array<string>();
  const extra = new Array<string>();

  const labelMapping = new Map<FiniteStateMachine, string>();
  const createdNodes = new Set<FiniteStateMachine>();

  const getLabel = (machine: FiniteStateMachine) => {
    // if (!labelMapping.has(machine)) {
    //   labelMapping.set(machine, `q${index++}`);
    // }

    // return labelMapping.get(machine)!;

    return machine.getName();

    // return [
    //   [machine.name, machine.value].join("_"),
    //   machine.startIds.join("_"),
    //   machine.endIds.join("_"),
    // ].join("__");

    // return (
    //   [machine.name, machine.value].join("_") +
    //   "__" +
    //   machine.start.map((machine) => machine.name).join("_")
    // );
  };

  const createNode = (
    machine: FiniteStateMachine,
    attributes: string[] = []
  ) => {
    const label = getLabel(machine);

    if (machine.isFinalState) {
      attributes.push("shape = doublecircle");
    }

    if (!createdNodes.has(machine.getName())) {
      nodes.push(
        `node [${attributes.join(" ")}]; ${label.replace(/\W/g, "")};`
      );
      createdNodes.add(machine.getName());
    }

    return label;
  };

  const addTransition = (
    from: FiniteStateMachine,
    to: FiniteStateMachine,
    label: string = "ε"
  ) => {
    transitions.push(
      `${createNode(from)} -> ${createNode(to)} [ label="${label.replace(
        /\W/g,
        ""
      )}" ]`
    );
  };

  const generateVizString = (machine: FiniteStateMachine) => {
    const done = new Set<FiniteStateMachine>();

    const generate = (m: FiniteStateMachine) => {
      if (!done.has(m.getName())) {
        done.add(m.getName());

        for (const [symbol, children] of m.transitions) {
          for (const child of children) {
            addTransition(m, child, symbol);
            generate(child);
          }
        }
      }

      return getLabel(m);
    };

    const startNode = generate(machine);
    extra.push(`node [shape = point]; qi`, `qi -> ${startNode}`);
    const nonFinalNodes = nodes.filter(
      (node) => !node.includes("shape = doublecircle")
    );
    const finalNodes = nodes.filter((node) =>
      node.includes("shape = doublecircle")
    );
    const data = [...nonFinalNodes, ...finalNodes, ...transitions, ...extra];

    const append = (line: string) => {
      fs.appendFileSync(`./result/${name}`, line + "\n");
    };

    // console.log(`digraph { ${data.join("\n")} }`);
    return `digraph { ${data.join("\n")} }`;
    // return "";
  };

  vizRender(`./result/${name}`, generateVizString(machine));
};
