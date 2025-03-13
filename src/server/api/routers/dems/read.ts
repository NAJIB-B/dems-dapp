import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const getAllEstate = publicProcedure
 .query(async ({ ctx, input }) => {
	return ctx.db.estate.findMany();
  });

export const readEstate = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	})
  )
  .query(async ({ ctx, input }) => {
	return ctx.db.estate.findFirst({
	  where: {
		id: input.publicKey,
	  },
	  include: {
		polls: true,
		members: true,
	  }
	});
  });

  export const findUserEstate = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	})
  )
  .query(async ({ ctx, input }) => {
	return ctx.db.member.findFirst({
	  where: {
		id: input.publicKey,
	  },
	  include: {
		estate: {
			include: {
				members: true,
				polls: true
			}
		}
	  }
	});
  });

  export const findMember = publicProcedure
  .input(
	z.object({
	  publicKey: z.string(),
	})
  )
  .query(async ({ ctx, input }) => {
	return ctx.db.member.findFirst({
	  where: {
		id: input.publicKey,
	  }
	});
  });

