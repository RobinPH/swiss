import fs from "node:fs";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
import BaseBNF, { BNFType, TestResult } from "../../BNF/BaseBNF";
import AtomBNF from "../../BNF/types/AtomBNF";
import ConcatBNF from "../../BNF/types/ConcatBNF";
import OrBNF from "../../BNF/types/OrBNF";
import { Task } from "../Queue";
import OptionalBNF from "../types/OptionalBNF";
import PlusBNF from "../types/PlusBNF";
import StarBNF from "../types/StarBNF";

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

export const vizualizeParseTree = (task: Task<TestResult<any, any[]>>) => {
  let nodeCount = 0;
  let cnt = 0;
  const data = new Array<string>();
  const newNode = (label?: string) => {
    const id = `n${nodeCount++}`;
    data.push(`${id} ;`);
    cnt++;

    if (label) {
      data.push(`${id} [label="${label.replace(/[^a-z0-9_ ]+/gi, "")}"];`);
      cnt++;
    }
    return id;
  };

  const connectNodes = (n0: string, n1: string) => {
    data.push(`${n0} -- ${n1} ;`);
    cnt++;
  };

  const process = (task: Task<TestResult<any, any[]>>, parent?: string) => {
    const node = newNode(task.label);

    if (parent) {
      connectNodes(parent, node);
    }

    for (const child of task.children) {
      if (child.cancelled) {
        continue;
      }
      if (child.ran) {
        process(child, node);
      }
    }
  };

  console.log("fooo");

  process(task);

  const input = `graph "" {
    ${data.join("\n")}
  }`;

  console.log(cnt);

  // console.log(input);

  vizRender("./result/parseTree", input);
};

export const vizualize = (name: string, machine: BaseBNF<any>) => {
  let index = 0;

  const generateVizString = (machine: BaseBNF<any>) => {
    const getLabel = () => {
      return `q${++index}`;
    };

    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

    const groupColor = new Map<BaseBNF<any>, string>();

    const done = new Map<BaseBNF<any>, { start: string; end: string }>();

    const nodes = new Array<string>();
    const transitions = new Array<string>();
    const extra = new Array<string>();

    const newNode = (attributes: string[] = []) => {
      const label = getLabel();

      nodes.push(`node [${attributes.join(" ")}]; ${label};`);

      return label;
    };

    const newTransition = (from: string, to: string, label: string = "ε") => {
      transitions.push(`${from} -> ${to} [ label="${label}" ]`);
    };

    const generate = (
      m: BaseBNF<any>,
      use: { start?: string; end?: string } = {}
    ) => {
      if (done.has(m)) {
        return done.get(m)!;
      }

      const start = use.start ?? newNode();

      const isFinal = m instanceof ConcatBNF || m instanceof OrBNF;
      const end = use.end ?? newNode(isFinal ? ["shape = doublecircle"] : []);

      done.set(m, {
        start,
        end,
      });

      if (m instanceof AtomBNF) {
        newTransition(start, end, m.character);
      } else if (m instanceof OrBNF) {
        for (const child of m.children) {
          const result = generate(child, { start, end });

          // newTransition(start, result.start);
          // newTransition(result.end, end);
        }
      } else if (m instanceof ConcatBNF) {
        let lastEnd = start;

        for (const child of m.children) {
          const result = generate(child, { start: lastEnd });

          // newTransition(lastEnd, result.start);
          lastEnd = result.end;
        }

        newTransition(lastEnd, end);
      } else if (m instanceof StarBNF) {
        const result = generate(m.bnf());
        newTransition(start, result.start);
        newTransition(result.end, end);
        newTransition(result.end, result.start);
      } else if (m instanceof PlusBNF) {
        const once = generate(m.bnf());
        const star = generate(m.bnf());

        newTransition(start, once.start);
        newTransition(once.end, star.start);
        newTransition(star.end, star.start);
        newTransition(star.end, end);
      } else if (m instanceof OptionalBNF) {
        const result = generate(m.bnf());
        newTransition(start, end);
        newTransition(start, result.start);
        newTransition(result.end, end);
      }
      return {
        start,
        end,
      };
    };

    const startNode = generate(machine);
    extra.push(`node [shape = point]; qi`, `qi -> ${startNode.start}`);
    const nonFinalNodes = nodes.filter(
      (node) => !node.includes("shape = doublecircle")
    );
    const finalNodes = nodes.filter((node) =>
      node.includes("shape = doublecircle")
    );
    const data = [...nonFinalNodes, ...finalNodes, ...transitions, ...extra];

    // console.log(`digraph { ${data.join("\n")} }`);
    return `digraph { ${data.join("\n")} }`;
  };

  vizRender(`./result/${name}`, generateVizString(machine));
};
