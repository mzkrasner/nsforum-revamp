import { OrbisDBRow } from "../types"
import { Category } from "../types/category"

type Props = {category: OrbisDBRow<Category>}
const CategoryDisplay = ({category}: Props) => {
  return (
    <span>{category.name}</span>
  )
}
export default CategoryDisplay