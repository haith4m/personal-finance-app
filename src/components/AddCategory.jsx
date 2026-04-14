import { memo } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";

import supabase from "../utils/supabase";

const AddCategory = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const { error } = await supabase.from("categories").insert([
        { name: values.name },
      ]);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Category added");
        resetForm();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2} style={{ marginBottom: "10px" }}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Category Name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />

        <Button variant="outlined" fullWidth type="submit">
          Add Category
        </Button>
      </Stack>
    </form>
  );
};

export default memo(AddCategory);