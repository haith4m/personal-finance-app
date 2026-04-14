import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function BudgetForm() {
  const [categories, setCategories] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const handleChange = (categoryId, value) => {
    setAmounts({
      ...amounts,
      [categoryId]: value,
    });
  };

  const saveBudget = async (categoryId) => {
    const amount = Number(amounts[categoryId]);

    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("budgets").upsert([
      {
        category_id: categoryId,
        limit_amount: amount,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error saving budget");
    } else {
      alert("Budget saved!");
    }
  };

 return (
  <div className="card">
    <h3>Set Budgets</h3>

    <div className="budget-form">
      {categories.map((cat) => (
        <div key={cat.id} className="budget-row">

          <span className="budget-label">{cat.name}</span>

          <input
            type="number"
            placeholder="£"
            value={amounts[cat.id] || ""}
            onChange={(e) =>
              handleChange(cat.id, e.target.value)
            }
          />

          <button onClick={() => saveBudget(cat.id)}>
            Save
          </button>

        </div>
      ))}
    </div>
  </div>
);
}