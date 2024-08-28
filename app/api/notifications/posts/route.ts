// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { connectDb } from "../../_orbis";
// import { addPostNotification } from "../../_orbis/queries";

// const updatePostNotificationsSchema = z.object({
//   authorId: z.string().min(1),
//   authorName: z.string().min(1),
//   postId: z.string().min(1),
// });

// export const POST = async (req: NextRequest) => {
//   const body: z.infer<typeof updatePostNotificationsSchema> = await req.json();
//   const isValid = updatePostNotificationsSchema.safeParse(body).success;
//   if (!isValid)
//     return NextResponse.json({ error: "Invalid data", status: 400 });

//   await connectDb();

//   const subscribers

//   const res = await addPostNotification(body);

//   if (!res) {
//     // handle error
//     console.log("Add post mutation was not successful");
//     // NextResponse.json()
//   }

//   return NextResponse.json({ success: true });
// };

// // TODO clear this and associated orbis queries
