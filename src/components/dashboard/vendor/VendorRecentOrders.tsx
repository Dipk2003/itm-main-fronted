const orders = [
  { name: "Dell XPS 13", status: "Completed", price: "₹75,000", date: "2024-06-15" },
  { name: "HP Pavilion", status: "Processing", price: "₹55,000", date: "2024-06-14" },
  { name: "MacBook Air", status: "Shipped", price: "₹95,000", date: "2024-06-13" },
]

export default function VendorRecentOrders() {
  return (
    <div className="bg-white p-6 rounded-md border shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
      <ul className="space-y-3">
        {orders.map((item, i) => (
          <li key={i} className="flex justify-between text-sm border-b pb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700">{item.price}</p>
              <p className="text-xs text-green-600">{item.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
