// "use server";

// import { orbis } from "@/shared/lib/orbis/provider";
// import { catchError } from "@/shared/lib/orbis/utils";

// export async function createPost(formData: FormData) {
//   const title = formData.get("title");
//   const content = formData.get("content");
//   const insertStatement = orbis.insert("posts").value({
//     content,
//     title,
//   });
//   const [result, error] = await catchError(() => insertStatement.run());
//   console.log(result);
//   console.log(error);
// }
