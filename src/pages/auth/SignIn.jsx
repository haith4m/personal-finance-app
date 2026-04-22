import { memo } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import AccountForm from "../../containers/AccountForm";
import supabase from "../../utils/supabase";

const SignIn = () => {
  const navigate = useNavigate();

  const signIn = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!result.error) {
      navigate("/");
      toast.success("Welcome!");
    } else if (result.error?.message) {
      toast.error(result.error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Member Access</p>
        <h1>Sign In</h1>
        <p className="auth-intro">Return to your ledger and pick up where your monthly story left off.</p>
        <AccountForm onSubmit={signIn} />
      </div>
    </div>
  );
};

export default memo(SignIn);
