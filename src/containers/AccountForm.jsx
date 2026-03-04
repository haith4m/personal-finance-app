import { memo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const validationSchema = yup.object({
  name: yup
    .string("Enter your name")
    .min(2, "Name should be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const AccountForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name:"",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values.names,values.email, values.password);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>

      <TextField
	fullWidth
        id="name"
        name="name"
	label="Full Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        style={{
          margin: "1rem",
         }}
       />

      
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        style={{
          margin: "1rem",
        }}
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        style={{
          margin: "1rem",
        }}
      />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        size="small"
        style={{
          margin: "1rem",
        }}
      >
        Submit
      </Button>
    </form>
  );
};

export default memo(AccountForm);
