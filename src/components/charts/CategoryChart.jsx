import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#7c3aed", "#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

const CategoryChart = () => {
  const transactions = useSelector((state) => state.finance.transactions);

  const grouped = {};

  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      grouped[tx.category] =
        (grouped[tx.category] || 0) + tx.amount;
    }
  });

  const data = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  /* CUSTOM LABEL (PERCENTAGE) */
  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <PieChart>

          {/* DONUT */}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}   // 🔥 donut effect
            outerRadius={100}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* TOOLTIP */}
          <Tooltip
            formatter={(value, name) => [`₹${value}`, name]}
          />

        </PieChart>
      </ResponsiveContainer>

      {/* CENTER INFO */}
      <div
        style={{
          position: "relative",
          top: "-190px",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          Total
        </div>
        <div style={{ fontSize: "20px", fontWeight: "600" }}>
          ₹{total}
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ marginTop: "-140px" }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  background: COLORS[index % COLORS.length],
                  marginRight: "8px",
                  borderRadius: "50%",
                }}
              />
              {item.name}
            </span>

            <span>₹{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;