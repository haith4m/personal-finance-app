import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddExpense() {

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    await supabase.from("transactions").insert([
      {
        user_id: user.id,
        amount: amount,
        description: description,
        transaction_date: new Date()
      }
    ]);

    alert("Expense added");
  };

  return (
    <div>

      <h1>Add Expense</h1>

      <input
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add Expense
      </button>

    </div>
  );
}
