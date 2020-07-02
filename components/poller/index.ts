import uuid from "uuid";

import { wait } from "components/wait";

type CreateOptions<P> = {
  action: () => Promise<P>;
  isComplete: (payload: P) => boolean;
}
type Active = {
  polling: boolean;
};

type PollerActive = {
  [id: string]: Active;
}

type Strategy = {
  delay: number;
  maxTries?: number;
}

type Strategies = Strategy[];

type PollerOptions = {
  strategies: Strategy | Strategies;
}

export type PollerInstance = {
  isActive: () => boolean;
  cancel: () => void;
}

const parseStrategies = (strategies: Strategy | Strategies): Strategies => {
  return Array.isArray(strategies) ? strategies : [strategies];
};

export const Poller = <P extends {}>({ strategies }: PollerOptions) => {
  let active: PollerActive = {};

  const pollerStrategies = parseStrategies(strategies);

  const execStrategy = (pollerId: string, { delay, maxTries = 10 }: Strategy, { action, isComplete }: CreateOptions<P>): Promise<boolean> => {
    let complete = false;
    let tries = 0;

    return new Promise(resolve => {
      (async function () {
        while (!complete && active[pollerId]?.polling && tries < maxTries) {
          const payload = await action();
          complete = isComplete(payload);
          if (!complete) {
            await wait(delay);
          }
          tries = tries + 1;
        }
        resolve(complete);
      })();
    });
  };

  return {
    create: (options: CreateOptions<P>): PollerInstance => {
      const pollerId = uuid.v4();

      (async function () {
        active[pollerId] = {
          polling: true
        };

        await pollerStrategies.reduce(async (complete, strategy) => {
          if (!await complete) {
            return execStrategy(pollerId, strategy, options);
          } else {
            return Promise.resolve(true);
          }
        }, Promise.resolve(false));

        delete active[pollerId];
      })();

      return {
        isActive: () => (active[pollerId]?.polling) || false,
        cancel: () => {
          if (active[pollerId]) {
            active[pollerId].polling = false;
          }
        }
      };
    },
    cancelAll: () => {
      active = {};
    }
  };
};

