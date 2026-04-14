import { memo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import supabase from "../utils/supabase";

const CategoryItem = ({ category, refresh }) => {
  const deleteCategory = async () => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted");
      refresh();
    }
  };

  return (
  <div className="category-item">

    <span>{category.name}</span>

    {!category.is_default && (
      <button
        className="delete-btn"
        onClick={deleteCategory}
      >
        <DeleteIcon fontSize="small" />
      </button>
    )}

  </div>
);
};

export default memo(CategoryItem);