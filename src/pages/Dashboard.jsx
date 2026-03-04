import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../utils/supabase";

export default function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.error(userError);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userData.user.id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProfile(data);
    }
  };

  const fetchTransactions = async () => {

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        description,
        transaction_date,
        categories(name)
      `)
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTransactions(data);
    }
  };

  const total = transactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth/sign-in");
  };

  return (
    <div style={{ padding: "1rem" }}>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>
          Welcome {profile?.name || "User"}  👋       </h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <h2>Total Monthly Spend</h2>
      <h1>£{total}</h1>

      <h3>Recent Transactions</h3>

      <ul>
        {transactions.slice(0, 5).map((t) => (
          <li key={t.id}>
            {t.categories?.name || "Other"} - £{t.amount}
          </li>
        ))}
      </ul>

    </div>
  );
}
