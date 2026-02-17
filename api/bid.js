import { bids } from "./_data.js";
import { parse } from "url";

export default function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

    const { query } = parse(req.url, true);
    const id = query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide an id"
      });
    }

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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}