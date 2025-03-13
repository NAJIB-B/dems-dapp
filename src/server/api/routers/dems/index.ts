import { createTRPCRouter } from "@/server/api/trpc";
import { createEstate, createMember, createPoll } from "./create";
import { findMember, findUserEstate, getAllEstate, readEstate } from "./read";
import {
castAgreeVote,
castDisagreeVote,
depositSol,
updatePollState
} from "./update";

export const demsRouter = createTRPCRouter({
  createEstate: createEstate,
  createMember: createMember,
  createPoll: createPoll,
  readEstate: readEstate,
  agreeVote: castAgreeVote,
  disagreeVote: castDisagreeVote,
  depositSol: depositSol,
  findUserEstate: findUserEstate,
  getAllEstate: getAllEstate,
  updatePollState: updatePollState,
  findMember: findMember
});
