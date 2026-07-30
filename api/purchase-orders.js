import { ordersData } from "./_ordersData.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  const query = { ...req.query };
  const id = query.id;
  const vendorName = query.vendorName;
  const sortBy = query.sortBy;

  if (id) {
    const order = ordersData.find(item => item.id === Number(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  }

  let result = [...ordersData];

  if (vendorName && vendorName.trim() !== "") {
    const searchTerm = vendorName.trim().toLowerCase();
    result = result.filter(item =>
      item.vendorName.toLowerCase().includes(searchTerm)
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No purchase orders found for the given vendor name"
      });
    }
  }

  if (sortBy === "asc") {
    result.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
  } else if (sortBy === "desc") {
    result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
}
