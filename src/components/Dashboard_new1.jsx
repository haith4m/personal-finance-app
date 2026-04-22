import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useAuth } from "../hooks/useAuth";
import supabase from "../utils/supabase";
<<<<<<< HEAD
import BudgetForm from "./BudgetForm";
import AddExpense from "../pages/AddExpense";
import CategoriesList from "./CategoriesList";
import TransactionsList from "./TransactionsList";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getCategoryMeta } from "../utils/categoryIcons";

const COLORS = ["#06b6d4", "#f97316", "#22c55e", "#ef4444", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

// Generate consistent color based on string hash
const getConsistentColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

const renderChartLegend = ({ payload }) => (
  <div className="chart-legend">
    {payload.map((entry, i) => {
      const { icon: Icon } = getCategoryMeta(entry.value);
      return (
        <div key={i} className="chart-legend-item">
          <Icon style={{ fontSize: 14, color: getConsistentColor(entry.value) }} />
          <span>{entry.value}</span>
        </div>
      );
    })}
  </div>
);
=======
import { fetchMonthlyBudgets } from "../utils/budgetSupport";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#b25539", "#48694f", "#c48a3a", "#2d5b53", "#856149"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getBudgetStatus = (spent, limit) => {
  if (limit <= 0) return { tone: "green", label: "On track" };
  const ratio = spent / limit;

  if (ratio >= 1) return { tone: "red", label: "Over budget" };
  if (ratio >= 0.75) return { tone: "amber", label: "Close to limit" };
  return { tone: "green", label: "On track" };
};
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [monthsCollapsed, setMonthsCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

<<<<<<< HEAD
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [insights, setInsights] = useState({
    highestCategory: null,
    highestAmount: 0,
    monthComparison: null,
  });

  const [trendData, setTrendData] = useState([]);
=======
  useEffect(() => {
    if (user) {
      fetchData();
      fetchGoals();
    }
  }, [user, selectedMonth]);
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)

  useEffect(() => {
    fetchCategories();
  }, []);

<<<<<<< HEAD
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

    // INSIGHTS
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevMonthTransactions = data?.filter((t) => {
      if (!t.transaction_date) return false;
      const date = new Date(t.transaction_date);
      return date.getMonth() === prevMonth;
    });

    const prevMonthTotal = prevMonthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    let highestCat = null;
    let highestAmt = 0;
    chartArray.forEach(c => {
      if (c.value > highestAmt) {
        highestAmt = c.value;
        highestCat = c.name;
      }
    });

    let monthComparisonStr = "";
    if (total > prevMonthTotal && prevMonthTotal > 0) {
      monthComparisonStr = `You spent £${(total - prevMonthTotal).toFixed(2)} more this month than last month.`;
    } else if (total < prevMonthTotal && prevMonthTotal > 0) {
      monthComparisonStr = `Great job! You spent £${(prevMonthTotal - total).toFixed(2)} less this month.`;
    } else if (prevMonthTotal === 0 && total > 0) {
      monthComparisonStr = `This is your first month tracking or no data last month.`;
    } else if (total === 0) {
      monthComparisonStr = `No spending recorded yet this month.`;
    } else {
      monthComparisonStr = `Spending is exactly the same as last month.`;
    }

    setInsights({
      highestCategory: highestCat,
      highestAmount: highestAmt,
      monthComparison: monthComparisonStr,
    });

    // TREND DATA (Total spent per month for the current year)
    const currentYear = new Date().getFullYear();
    const yearlyTransactions = data?.filter((t) => {
      if (!t.transaction_date) return false;
      const date = new Date(t.transaction_date);
      return date.getFullYear() === currentYear;
    });

    const monthlyTotals = new Array(12).fill(0);
    yearlyTransactions?.forEach((t) => {
      const month = new Date(t.transaction_date).getMonth();
      monthlyTotals[month] += Number(t.amount);
    });

    setTrendData(
      months.map((m, i) => ({
        month: m,
        spent: monthlyTotals[i],
      }))
    );

    // BUDGETS
    const { data: budgets } = await supabase
      .from("budgets")
      .select(`
        id,
        limit_amount,
        categories(id, name)
      `)
      .order('created_at', { ascending: false });

    // Deduplicate budgets by category name (or ID)
    const uniqueBudgets = [];
    const seenCategories = new Set();
    
    if (budgets) {
      for (const b of budgets) {
        if (!b.categories) continue;
        const catName = b.categories.name;
        if (!seenCategories.has(catName)) {
          seenCategories.add(catName);
          uniqueBudgets.push(b);
        }
      }
    }

    const merged = uniqueBudgets.map((b) => {
      const spent =
        chartArray.find((c) => c.name === b.categories.name)?.value || 0;

      return {
        name: b.categories.name,
        limit: b.limit_amount,
        spent,
      };
    });

    setBudgetData(merged);
=======
  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
  };

  const fetchData = async () => {
    const year = new Date().getFullYear();
    const { data } = await supabase
      .from("transactions")
      .select("id, amount, description, transaction_date, created_at, categories(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const filtered = (data || []).filter((transaction) => {
      const date = new Date(transaction.transaction_date || transaction.created_at);
      return date.getFullYear() === year && date.getMonth() === selectedMonth;
    });

    setTransactions(filtered);

    const grouped = {};
    filtered.forEach((transaction) => {
      const category = transaction.categories?.name || "Other";
      grouped[category] = (grouped[category] || 0) + Number(transaction.amount);
    });
    setChartData(Object.entries(grouped).map(([name, value]) => ({ name, value })));

    const { data: budgets } = await fetchMonthlyBudgets(supabase);

    setBudgetData(
      (budgets || []).map((budget) => ({
          name: budget.categories.name,
          limit: budget.limit_amount,
          spent: grouped[budget.categories.name] || 0,
        }))
    );
  };

  const fetchGoals = async () => {
    const { data } = await supabase.from("goals").select("current_amount, target_amount").eq("user_id", user.id);
    setGoals(data || []);
  };

  const handleQuickAdd = async () => {
    if (!amount) {
      alert("Enter an amount");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        amount: Number(amount),
        description,
        category_id: categoryId || null,
        transaction_date: new Date(),
      },
    ]);

    if (!error) {
      setAmount("");
      setDescription("");
      setCategoryId("");
      setShowAddForm(false);
      fetchData();
    }
  };

  const total = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const overBudget = budgetData.filter((budget) => budget.spent > budget.limit).length;
  const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.current_amount), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <p className="section-kicker">Monthly edition</p>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p className="page-subtitle">A quieter read of spending, budgets, and savings.</p>
        </div>
<<<<<<< HEAD
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

      {/* TOP SUMMARY ROW */}
      <div className="top-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', gridColumn: '1 / -1' }}>
        {/* TOTAL */}
        <div className="card total-card">
          <h3>Total Spending</h3>
          <h1>£{total.toFixed(2)}</h1>
          <p>{transactions.length} transactions</p>

          {overBudgetCount > 0 && (
            <div className="alert">
              🚨 {overBudgetCount} categories over budget
            </div>
          )}
        </div>

        {/* INSIGHTS */}
        <div className="card insights-card">
          <h3>Smart Insights</h3>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Top Expense</strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                {insights.highestCategory ? `Most spent on ${insights.highestCategory} (£${insights.highestAmount.toFixed(2)})` : "No expenses yet"}
              </span>
            </div>
            
            <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--color-secondary)' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Monthly Comparison</strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                {insights.monthComparison}
              </span>
            </div>
=======
      </div>

      <div className="months-panel">
        <div className="card-section-header">
          <div>
            <p className="section-kicker">Period</p>
            <h3>{MONTHS[selectedMonth]}</h3>
          </div>
          <button
            className="btn months-toggle"
            type="button"
            onClick={() => setMonthsCollapsed((current) => !current)}
            aria-expanded={!monthsCollapsed}
            aria-controls="dashboard-months"
          >
            {monthsCollapsed ? "Show months" : "Hide months"}
            {monthsCollapsed ? <ExpandMoreRoundedIcon fontSize="small" /> : <ExpandLessRoundedIcon fontSize="small" />}
          </button>
        </div>

        {!monthsCollapsed && (
          <div className="months" id="dashboard-months">
            {MONTHS.map((month, index) => (
              <button key={month} className={selectedMonth === index ? "active" : ""} onClick={() => setSelectedMonth(index)}>
                {month}
              </button>
            ))}
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* ADD EXPENSE */}
      <div className="card add-expense-card">
        <h3>Add Expense</h3>
        <AddExpense compact onRefresh={fetchData} />
      </div>

      {/* CATEGORIES */}
      <div className="card category-card">
        <h3>Categories</h3>
        <CategoriesList compact />
      </div>

      {/* CHARTS CONTAINER */}
      <div className="charts-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* PIE CHART */}
        <div className="card">
          <h3>Spending by Category</h3>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  isAnimationActive={true}
                  animationBegin={150}
                  animationDuration={700}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getConsistentColor(entry.name)} />
                  ))}
                </Pie>
                <Legend content={renderChartLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TREND CHART */}
        <div className="card">
          <h3>Monthly Trend</h3>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `£${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => [`£${value}`, 'Spent']}
                />
                <Line 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--bg-card)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationBegin={150}
                  animationDuration={700}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
=======
      <div className="card total-card">
        <p className="section-kicker">Lead figure</p>
        <h3>Total Spending - {MONTHS[selectedMonth]}</h3>
        <h1>£{total.toFixed(2)}</h1>
        <p>{transactions.length} transactions recorded</p>
        {overBudget > 0 && (
          <div className="alert">
            <WarningAmberRoundedIcon fontSize="small" />
            <span>
              {overBudget} {overBudget === 1 ? "category is" : "categories are"} over budget.{" "}
              <Link to="/budgets">Inspect the limits</Link>
            </span>
          </div>
        )}
      </div>

      <div className="card">
        {!showAddForm ? (
          <button className="btn ledger-btn" style={{ width: "100%" }} onClick={() => setShowAddForm(true)}>
            Add a quick expense note
          </button>
        ) : (
          <>
            <div className="quick-add-header">
              <h3>Quick Add Expense</h3>
              <button className="delete-btn" onClick={() => setShowAddForm(false)} aria-label="Close quick add form">
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>
            <div className="expense-form">
              <input type="number" placeholder="Amount (£)" value={amount} onChange={(event) => setAmount(event.target.value)} />
              <input type="text" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
              <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button onClick={handleQuickAdd}>Record Expense</button>
            </div>
            <p className="subtle-note">
              Need more context? <Link to="/transactions">Open the full transactions page</Link>
            </p>
          </>
        )}
      </div>

      <div className="nav-cards">
        <Link to="/transactions" className="nav-card">
          <span className="nav-card-icon">
            <CreditCardRoundedIcon />
          </span>
          <div className="nav-card-info">
            <p className="nav-card-label">Transactions</p>
            <h3 className="nav-card-value">{transactions.length} this month</h3>
          </div>
          <span className="nav-card-arrow">
            <ArrowForwardRoundedIcon fontSize="small" />
          </span>
        </Link>

        <Link to="/budgets" className="nav-card">
          <span className="nav-card-icon">
            <PieChartRoundedIcon />
          </span>
          <div className="nav-card-info">
            <p className="nav-card-label">Budgets</p>
            <h3 className="nav-card-value" style={{ color: overBudget > 0 ? "var(--color-error)" : "var(--color-success)" }}>
              {overBudget > 0 ? `${overBudget} over limit` : "Steady"}
            </h3>
          </div>
          <span className="nav-card-arrow">
            <ArrowForwardRoundedIcon fontSize="small" />
          </span>
        </Link>

        <Link to="/reports" className="nav-card">
          <span className="nav-card-icon">
            <TrendingUpRoundedIcon />
          </span>
          <div className="nav-card-info">
            <p className="nav-card-label">Reports</p>
            <h3 className="nav-card-value">Read the larger pattern</h3>
          </div>
          <span className="nav-card-arrow">
            <ArrowForwardRoundedIcon fontSize="small" />
          </span>
        </Link>

        <Link to="/goals" className="nav-card">
          <span className="nav-card-icon">
            <FlagRoundedIcon />
          </span>
          <div className="nav-card-info">
            <p className="nav-card-label">Goals</p>
            <h3 className="nav-card-value">{goals.length > 0 ? `£${totalSaved.toFixed(0)} / £${totalTarget.toFixed(0)}` : "Set your target"}</h3>
          </div>
          <span className="nav-card-arrow">
            <ArrowForwardRoundedIcon fontSize="small" />
          </span>
        </Link>
      </div>

      <div className="dashboard-mid">
        <div className="card">
          <div className="card-section-header">
            <h3>Spending by Category</h3>
            <span className="section-chip">Chart</span>
          </div>
          {chartData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={92}
                    stroke="#f1eadc"
                    strokeWidth={4}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `£${Number(value).toFixed(2)}`}
                    contentStyle={{ background: "#fbf5ea", border: "1px solid rgba(33, 27, 23, 0.18)", borderRadius: 14 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty-copy">No transactions this month.</p>
          )}
        </div>

        <div className="card">
          <div className="card-section-header">
            <h3>Budget Snapshot</h3>
            <Link to="/budgets" className="view-all-link">
              Manage →
            </Link>
          </div>

          {budgetData.length === 0 ? (
            <p className="empty-copy">
              No budgets set. <Link to="/budgets">Create your first one</Link>
            </p>
          ) : (
            budgetData.slice(0, 4).map((budget, index) => {
              const percent = Math.min((budget.spent / budget.limit) * 100, 100);
              const status = getBudgetStatus(budget.spent, Number(budget.limit));
              const color = status.tone === "red" ? "#a0412f" : status.tone === "amber" ? "#ad722f" : "#48694f";
              return (
                <div key={index} className="budget-item">
                  <div className="budget-header">
                    <div className="budget-name-row">
                      <span className={`status-dot ${status.tone}`} aria-hidden="true" />
                      <span className="budget-name">{budget.name}</span>
                    </div>
                    <span className="budget-amount">
                      £{budget.spent.toFixed(0)} / £{budget.limit}
                    </span>
                  </div>
                  <div className="bar">
                    <div className="fill" style={{ width: `${percent}%`, background: color }} />
                  </div>
                </div>
              );
            })
          )}

          {budgetData.length > 4 && (
            <p className="subtle-note">
              <Link to="/budgets">+{budgetData.length - 4} more categories</Link>
            </p>
          )}
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
        </div>
      </div>

      <div className="card">
        <div className="card-section-header">
          <h3>Recent Transactions</h3>
          <Link to="/transactions" className="view-all-link">
            View all →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="empty-copy">No transactions this month.</p>
        ) : (
          transactions.slice(0, 5).map((transaction, index) => (
            <div key={index} className="transaction">
              <div>
                <strong>{transaction.description || "No description"}</strong>
                <p>{transaction.categories?.name || "Uncategorised"}</p>
              </div>
              <span className="money">£{Number(transaction.amount).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
<<<<<<< HEAD

      {/* TRANSACTIONS */}
      <div className="card">
        <h3>Transactions</h3>
        <TransactionsList transactions={transactions} onRefresh={fetchData} />
      </div>

=======
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
    </div>
  );
}
