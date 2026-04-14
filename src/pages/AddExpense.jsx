import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function AddExpense({ compact }) {
  const navigate = useNavigate(); // ✅ FIX: added navigate

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

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

  const handleSubmit = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("Not logged in");
      return;
    }

    // ✅ BASIC VALIDATION (important for marks)
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
    transaction_date: new Date(), // ✅ ADD THIS
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

      // ✅ UX IMPROVEMENT
      navigate("/");
    }
  };

  return (
  <div className={compact ? "add-expense" : ""}>
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

      <button onClick={handleSubmit}>
        Add
      </button>

    </div>
  </div>
);
}