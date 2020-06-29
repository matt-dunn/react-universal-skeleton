import {Ability, AbilityBuilder} from "@casl/ability";
import {PureAbility} from "@casl/ability/dist/types/PureAbility";

import {User} from "./AuthMiddleware";

export function defineAbilitiesFor(user: User) {
  const { can, cannot, rules } = new AbilityBuilder<PureAbility<any, any>>();

  can("GET", "/api/login/");

  if (user.authenticated) {
    can("GET", "/api/list/");
  }

  // can("read", "BlogPost");
  // can manage (i.e., do anything) own posts
  // can('manage', 'BlogPost', { author: user.id });
  // // cannot delete a post if it was created more than a day ago
  // cannot('delete', 'BlogPost', {
  //     createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
  // });

  return new Ability(rules);
}
