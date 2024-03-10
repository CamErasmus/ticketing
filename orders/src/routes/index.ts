import express, { Request, Response } from "express";
import { requireAuth } from "@aspiro/common";
import { Order } from "../models/order";

const router = express.Router();

// Show order for a specific user and it's associated tickets
router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
