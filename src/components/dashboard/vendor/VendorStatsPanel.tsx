const stats = [
  { label: "Total Products", value: 156, icon: "📦" },
  { label: "Total Orders", value: 428, icon: "📑" },
  { label: "Total Revenue", value: "₹850,000", icon: "💰" },
  { label: "Monthly Growth", value: "+12.5%", icon: "📈" },
]

export default function VendorStatsPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-md border shadow-sm">
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-sm text-gray-600">{item.label}</div>
          <div className="font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
