import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function TransactionsList({ selectedMonth, onRefresh }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", description: "", categoryId: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]);

  const fetchTransactions = async () => {
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

    const filtered =
      selectedMonth !== undefined
        ? (data || []).filter((t) => {
            if (!t.transaction_date) return true;
            return new Date(t.transaction_date).getMonth() === selectedMonth;
          })
        : (data || []);

    setTransactions(filtered);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    setCategories(data || []);
  };

  const refresh = () => {
    fetchTransactions();
    if (onRefresh) onRefresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      alert("Error deleting transaction");
    } else {
      refresh();
    }
  };

  const handleEditClick = (t) => {
    setEditingId(t.id);
    setEditForm({
      amount: t.amount,
      description: t.description || "",
      categoryId: t.category_id || "",
    });
  };

  const handleEditSave = async (id) => {
    if (!editForm.amount) {
      alert("Please enter an amount");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: Number(editForm.amount),
        description: editForm.description,
        category_id: editForm.categoryId || null,
      })
      .eq("id", id);

    if (error) {
      alert("Error updating transaction");
    } else {
      setEditingId(null);
      refresh();
    }
  };

  if (transactions.length === 0) {
    return <p style={{ color: "#94a3b8", fontSize: "14px" }}>No transactions this month.</p>;
  }

  return (
    <div>
      {transactions.map((t) =>
        editingId === t.id ? (
          <div key={t.id} className="transaction transaction-editing">
            <div className="expense-form" style={{ flex: 1, gap: "8px" }}>
              <input
                type="number"
                placeholder="Amount (£)"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <select
                value={editForm.categoryId}
                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="tx-actions">
                <button className="btn-save" onClick={() => handleEditSave(t.id)}>
                  Save
                </button>
                <button className="btn-cancel" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div key={t.id} className="transaction">
            <div>
              <strong>{t.description || "—"}</strong>
              <p>{t.categories?.name || "No category"}</p>
            </div>
            <div className="tx-right">
              <span className="tx-amount">£{t.amount}</span>
              <div className="tx-actions">
                <button className="btn-edit" onClick={() => handleEditClick(t)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
