import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  // Optional: prevent flicker while auth loads
  if (loading) {
    return <p>Loading...</p>;
  }

  // Redirect if logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="home-page">
      <p className="home-kicker">Editorial Ledger Edition</p>
      <h1>Personal Finance Manager</h1>
      <p>Track spending, frame goals, and read your money like a well-kept household column.</p>

      <div className="home-actions">
        <Link to="/auth/sign-in">Sign In</Link>
        <Link to="/auth/sign-up">Sign Up</Link>
      </div>
    </div>
  );
}
