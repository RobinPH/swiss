export class Task<T> {
  id = Symbol();
  label?: string;
  run: () => void;
  #cancelled: boolean = false;
  callback: (result: T, id: Symbol) => void;
  ran: boolean;
  children = new Array<Task<T>>();
  result?: T;

  constructor(args: {
    label?: string;
    run: () => void;
    callback?: (result: T, id: Symbol) => void;
    cancelled?: boolean;
    ran?: boolean;
    depth?: number;
    parent?: Task<T>;
  }) {
    this.label = args.label;
    this.run = args.run;
    this.cancelled = args.cancelled ?? false;
    this.callback = args.callback ?? (() => {});
    this.ran = args.ran ?? false;

    if (args.parent) {
      args.parent.addChild(this);
    }
  }

  addChild(...children: Array<Task<T>>) {
    this.children.push(...children);
  }

  set cancelled(cancelled: boolean) {
    this.#cancelled = cancelled;

    for (const child of this.children) {
      child.cancelled = cancelled;
    }
  }

  get cancelled() {
    return this.#cancelled;
  }
}

export class Queue<Result> {
  #queue = new Array<Task<Result>>();
  #running = false;
  #cnt = 0;

  registerTask(task: Task<Result>) {
    this.#queue.push(task);

    if (!this.#running) {
      this.run();
    }

    return task;
  }

  async run() {
    const total = new Map<string, number>();
    this.#running = true;
    while (this.#queue.length > 0) {
      const task = this.#queue.shift()!;

      if (task.cancelled) {
        // console.log("Cancelled");
      }

      if (task.cancelled || task.ran) {
        continue;
      }

      if (task.label) {
        total.set(task.label, (total.get(task.label) ?? 0) + 1);
      }
      task.ran = true;
      // console.log("Running", task.label);

      task.run();
      this.#cnt++;

      // if (cnt % 1000 === 0) {
      //   console.log(Array.from(total.entries()).sort((a, b) => b[1] - a[1]));
      // }

      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.#running = false;
  }
}
