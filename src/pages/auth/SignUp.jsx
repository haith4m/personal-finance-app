import { memo } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import AccountForm from "../../containers/AccountForm";
import supabase from "../../utils/supabase";

const SignUp = () => {
  const navigate = useNavigate();

  const signUp = async (name, email, password) => {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP RESULT:", result);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    const user = result.data.user;

    const { error } = await supabase.from("profiles").upsert([
      {
        id: user.id,
        email: user.email,
        name: name,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Error saving profile");
      return;
    }

    toast.success("Account created!");
    navigate("/");
  };

  return (
    <>
      <h1>Sign Up</h1>
      <AccountForm onSubmit={signUp} />
    </>
  );
};

export default memo(SignUp);