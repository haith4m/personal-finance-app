import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import BudgetForm from "./BudgetForm";
import AddExpense from "../pages/AddExpense";
import CategoriesList from "./CategoriesList";
import TransactionsList from "./TransactionsList";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function Dashboard() {

  // STATE
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  const [darkMode, setDarkMode] = useState(true);

  // ✅ FIX: months was missing
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // DARK MODE
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  // ✅ FIX: fetch data when month changes
  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        description,
        transaction_date,
        category_id,
        categories(name)
      `)
      .order("created_at", { ascending: false });

    const filtered = data?.filter((t) => {
      if (!t.transaction_date) return true;
      const date = new Date(t.transaction_date);
      return date.getMonth() === selectedMonth;
    });

    setTransactions(filtered || []);

    const totalAmount =
      filtered?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    setTotal(totalAmount);

    // GROUP
    const grouped = {};
    filtered?.forEach((t) => {
      const cat = t.categories?.name || "Other";
      if (!grouped[cat]) grouped[cat] = 0;
      grouped[cat] += Number(t.amount);
    });

    const chartArray = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));

    setChartData(chartArray);

    // BUDGETS
    const { data: budgets } = await supabase
      .from("budgets")
      .select(`
        limit_amount,
        categories(name)
      `);

    const merged = budgets?.map((b) => {
      const spent =
        chartArray.find((c) => c.name === b.categories.name)?.value || 0;

      return {
        name: b.categories.name,
        limit: b.limit_amount,
        spent,
      };
    });

    setBudgetData(merged || []);
  };

  const overBudgetCount = budgetData.filter(
    (b) => b.spent > b.limit
  ).length;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <div className="header-center">
            <h1>Personal Finance Manager</h1>
            <p>Track your spending</p>
        </div>

        <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
        >
            {darkMode ? "🌙" : "☀️"}
        </button>
    </div>

      {/* MONTHS */}
      <div className="months">
        {months.map((m, i) => (
          <button
            key={i}
            className={selectedMonth === i ? "active" : ""}
            onClick={() => setSelectedMonth(i)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* TOTAL */}
      <div className="card total-card">
        <h3>Total Spending</h3>
        <h1>£{total}</h1>
        <p>{transactions.length} transactions</p>

        {overBudgetCount > 0 && (
          <div className="alert">
            🚨 {overBudgetCount} categories over budget
          </div>
        )}
      </div>

      {/* ADD EXPENSE */}
      <div className="card add-expense-card">
        <h3>Add Expense</h3>
        <AddExpense compact />
      </div>

      {/* CATEGORIES */}
      <div className="card category-card">
        <h3>Categories</h3>
        <CategoriesList compact />
      </div>

      {/* CHART */}
      <div className="card">
        <h3>Spending by Category</h3>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BUDGET FORM */}
      <BudgetForm />

      {/* BUDGET */}
      <div className="card">
        <h3>Budget Progress</h3>

        {budgetData.map((b, i) => {
          const percent = Math.min((b.spent / b.limit) * 100, 100);

          let color = "#22c55e";
          if (percent >= 70) color = "#f59e0b";
          if (percent >= 100) color = "#ef4444";

          return (
            <div key={i} className="budget-item">
              <div className="budget-header">
                <span className="budget-name">{b.name}</span>
                <span className="budget-amount">
                  £{b.spent} / £{b.limit}
                </span>
              </div>

              <div className="bar">
                <div
                  className="fill"
                  style={{
                    width: `${percent}%`,
                    background: color,
                  }}
                />
              </div>

              <div className="budget-footer">
                <span style={{ color }}>
                  {percent.toFixed(0)}% used
                </span>

                {b.spent > b.limit && (
                  <span className="over-text">
                    Over by £{b.spent - b.limit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TRANSACTIONS */}
      <div className="card">
        <h3>Transactions</h3>
        <TransactionsList transactions={transactions} onRefresh={fetchData} />
      </div>

    </div>
  );
}