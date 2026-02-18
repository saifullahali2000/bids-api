import { bids } from "./_data.js";

export default function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

  // Spread into a normal object to avoid null prototype issues
  const query = { ...req.query };
  const id = query.id;
  const createdBy = query.createdBy;
  const sortBy = query.sortBy; // 'asc' or 'desc'

  // If id is provided, return a single bid
  if (id) {
    const numericId = Number(id);
    const bid = bids.find(b => b.id === numericId);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: bid
    });
  }

  // Start with all bids or filter by createdBy
  let result = [...bids];

  if (createdBy) {
    result = result.filter(b =>
      b.createdBy.toLowerCase().includes(createdBy.toLowerCase())
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bids found for the given name"
      });
    }
  }

  // Sort by startDate if sortBy is provided
  if (sortBy === 'asc') {
    result.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  } else if (sortBy === 'desc') {
    result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
}