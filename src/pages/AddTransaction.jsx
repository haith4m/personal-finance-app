import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function AddTransaction() {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {

    const user = (await supabase.auth.getUser()).data.user;

    await supabase.from("transactions").insert([
      {
        user_id: user.id,
        amount: amount,
        category_id: category,
        description: description,
        transaction_date: new Date()
      }
    ]);
  };

  return (
    <div>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>Add Transaction</button>

    </div>
  );
}
