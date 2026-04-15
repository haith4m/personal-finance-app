import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import toast from "react-hot-toast";

export default function BudgetForm() {
  const [categories, setCategories] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesAndBudgets();
  }, []);

  const fetchCategoriesAndBudgets = async () => {
    const { data: cats } = await supabase.from("categories").select("*");
    setCategories(cats || []);

    const { data: buds } = await supabase.from("budgets").select("category_id, limit_amount");
    
    if (buds) {
      const initialAmounts = {};
      // Iterate from oldest to newest to keep the latest if duplicates exist
      buds.forEach(b => {
        initialAmounts[b.category_id] = b.limit_amount;
      });
      setAmounts(initialAmounts);
    }
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
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);

    // Check if budget exists for this category
    const { data: existingBudget } = await supabase
      .from("budgets")
      .select("id")
      .eq("category_id", categoryId)
      .maybeSingle();

    let error;

    if (existingBudget) {
      const res = await supabase
        .from("budgets")
        .update({ limit_amount: amount })
        .eq("id", existingBudget.id);
      error = res.error;
    } else {
      const res = await supabase.from("budgets").insert([
        {
          category_id: categoryId,
          limit_amount: amount,
        },
      ]);
      error = res.error;
    }

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Error saving budget");
    } else {
      toast.success("Budget saved!");
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