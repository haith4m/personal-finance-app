import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        description,
        categories(name)
      `)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  };

  return (
    <div>
      <h2>Transactions</h2>

      {transactions.map((t) => (
        <div key={t.id}>
          <p>
            {t.categories?.name || "No category"} - £{t.amount}
            <br />
            <small>{t.description}</small>
         </p>
        </div>
      ))}
    </div>
  );
}