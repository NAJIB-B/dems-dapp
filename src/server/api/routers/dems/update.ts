import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";



export const castAgreeVote = publicProcedure
  .input(
	z.object({
	  poll: z.string(),
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.poll.update({
	  where: {
		id: input.poll,
	  },
	  data: {
		agreeVotes: {increment: 1}
	  },
	});
  });


  export const castDisagreeVote = publicProcedure
  .input(
	z.object({
	  poll: z.string(),
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.poll.update({
	  where: {
		id: input.poll,
	  },
	  data: {
		disagreeVotes: {increment: 1}
	  },
	});
  });

  export const depositSol = publicProcedure
  .input(
	z.object({
	  id: z.string(),
	  amount: z.number()
	})
  )
  .mutation(async ({ ctx, input }) => {
	return ctx.db.estate.update({
	  where: {
		id: input.id,
	  },
	  data: {
		vaultBalance: {increment: input.amount}
	  },
	});
  });

