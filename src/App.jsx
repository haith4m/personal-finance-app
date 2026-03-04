import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  if (!user) {
    return <h2>Please sign in to access your finance dashboard</h2>;
  }

  return (
    <div>
      <h1>Personal Finance Dashboard</h1>
      <p>Welcome {user.email}</p>

      <p>Your financial data will appear here.</p>
    </div>
  );
}

export default App;
