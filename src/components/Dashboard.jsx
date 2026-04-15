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

export default function Dashboard() {

  // STATE
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);

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
          </div>
        </div>
      </div>

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