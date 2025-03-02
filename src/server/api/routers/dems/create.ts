import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";


export const createEstate = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	  name: z.string(),
	  leader: z.string(),
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.estate.create({
	  data: {
		id: input.publicKey,
		name: input.name,
		leader: input.leader
	  },
	});
  });



  export const createPoll = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	  question: z.string(),
	  creator: z.string(),
	  estateId: z.string(),
	  amount: z.number()
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.poll.create({
	  data: {
		id: input.publicKey,
		question: input.question,
		pollCreator: input.creator,
		estateId: input.estateId,
		amount: input.amount
	  },
	});
  });

  export const createMember = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	  estateId: z.string()
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.member.create({
	  data: {
		id: input.publicKey,
		estateId: input.estateId
	  },
	});
  });

  
