import { Action, Dispatch } from "redux";

export const mapAllActions = <A>(dispatch: Dispatch<Action>, actions: A) => Object.entries(actions).reduce((group, [groupKey, groupValue]) => {
  group[groupKey] = Object.entries(groupValue).reduce((action, [actionKey, actionValue]: [string, any]) => {
    action[actionKey] = (...args: Parameters<typeof actionValue>) => dispatch(actionValue(...args));
    return action;
  }, {} as any);
  return group;
}, {} as any);
