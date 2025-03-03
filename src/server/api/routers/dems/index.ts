import { createTRPCRouter } from "@/server/api/trpc";
import { createEstate, createMember, createPoll } from "./create";
import { findUserEstate, getAllEstate, readEstate } from "./read";
import {
castAgreeVote,
castDisagreeVote,
depositSol
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
  getAllEstate: getAllEstate
});
