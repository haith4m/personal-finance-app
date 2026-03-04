import { memo } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import AccountForm from "../../containers/AccountForm";
import supabase from "../../utils/supabase";

const SignUp = () => {
  const navigate = useNavigate();

  const signUp = async (name, email, password) => {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success(
      "Welcome! Please check your inbox to confirm your account."
    );

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
