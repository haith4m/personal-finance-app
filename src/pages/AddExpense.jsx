import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

<<<<<<< HEAD
const validationSchema = Yup.object({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  description: Yup.string()
    .max(100, "Description must be 100 characters or less"),
  date: Yup.string()
    .required("Date is required"),
  categoryId: Yup.string()
    .required("Category is required"),
});
=======
export default function AddExpense({ compact }) {
  const navigate = useNavigate();
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)

export default function AddExpense({ compact, onRefresh }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      categoryId: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        toast.error("Not logged in");
        return;
      }

<<<<<<< HEAD
      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          amount: Number(values.amount),
          description: values.description,
          category_id: values.categoryId,
          transaction_date: new Date(values.date).toISOString(),
        },
      ]);

      if (error) {
        console.error(error);
        toast.error("Error adding expense. Please try again later.");
      } else {
        toast.success("Expense added successfully!");
        resetForm({
          values: {
            amount: "",
            description: "",
            date: new Date().toISOString().slice(0, 10),
            categoryId: "",
          },
        });
        if (onRefresh) {
          onRefresh();
        } else {
          navigate("/");
        }
      }
    },
  });
=======
    // Basic validation
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
  {
    user_id: user.id,
    amount: Number(amount),
    description,
    category_id: categoryId || null,
    transaction_date: new Date(),
  },
]);

    if (error) {
      console.error(error);
      alert("Error adding expense");
    } else {
      alert("Expense added!");

      // reset form
      setAmount("");
      setDescription("");
      setCategoryId("");

      // UX improvement
      navigate("/");
    }
  };
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)

  if (compact) {
    return (
      <div className="expense-form">
        <input
          type="number"
          placeholder="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={handleSubmit}>Add</button>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className={compact ? "add-expense" : ""}>
      <form className="expense-form" onSubmit={formik.handleSubmit} noValidate>

        <div className="field">
          <input
            type="number"
            name="amount"
            placeholder="Amount (£)"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.amount && formik.errors.amount && (
            <span className="field-error">{formik.errors.amount}</span>
          )}
        </div>

        <div className="field">
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <span className="field-error">{formik.errors.description}</span>
          )}
        </div>

        <div className="field">
          <input
            type="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date && (
            <span className="field-error">{formik.errors.date}</span>
          )}
        </div>

        <div className="field">
          <select
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a category</option>
=======
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <div className="card">
        <h3>Add Expense</h3>
        <div className="expense-form">
          <input
            type="number"
            placeholder="Amount (£)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Category</option>
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
<<<<<<< HEAD
          {formik.touched.categoryId && formik.errors.categoryId && (
            <span className="field-error">{formik.errors.categoryId}</span>
          )}
        </div>

        <button type="submit">Add</button>

      </form>
=======
          <button onClick={handleSubmit}>Add Expense</button>
        </div>
      </div>
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
    </div>
  );
}
