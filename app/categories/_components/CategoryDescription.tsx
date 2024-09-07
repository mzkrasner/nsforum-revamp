import { HTMLProps } from "react";

const CategoryDescription = (props: HTMLProps<HTMLParagraphElement>) => {
  return (
    <p {...props}>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae natus
      perspiciatis alias. Adipisci eius, autem praesentium veritatis tempore qui
      sunt deleniti rerum aut assumenda.
    </p>
  );
};
export default CategoryDescription;
