import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";


// export const createEstate = publicProcedure
//   .input(
// 	z.object({
// 	  publicKey: z.string(),
// 	  name: z.string(),
// 	  leader: z.string(),
// 	})
//   )
//   .mutation(async ({ ctx, input }) => {
// 	return ctx.db.estate.create({
// 	  data: {
// 		id: input.publicKey,
// 		name: input.name,
// 		leader: input.leader
// 	  },
// 	});
//   });

  export const createEstateWithMember = publicProcedure
  .input(
    z.object({
      estatePublicKey: z.string(), // PDA for the Estate
      name: z.string(), // Estate name
      leaderPublicKey: z.string(), // Leader's public key
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Use a transaction to create both Estate and Member
    return ctx.db.$transaction(async (prisma) => {
      // Create the Estate
      const estate = await prisma.estate.create({
        data: {
          id: input.estatePublicKey,
          name: input.name,
          leader: input.leaderPublicKey,
        },
      });

      // Create the Member
      const member = await prisma.member.create({
        data: {
          id: input.leaderPublicKey,
          estateId: input.estatePublicKey,
        },
      });

      // Return both records (optional)
      return { estate};
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

  
