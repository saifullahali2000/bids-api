import { bids } from "./_data.js";
import { parse } from "url";

export default function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=60, stale-while-revalidate"
  );

  // Parse query params directly from the URL (works in both local dev and Vercel)
  const { query } = parse(req.url, true);
  const id = query.id;

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

  // No id provided — return all bids
  return res.status(200).json({
    success: true,
    count: bids.length,
    data: bids
  });
}