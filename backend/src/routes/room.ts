import { Router } from "express";

const router = Router();
import {getRoom} from "../utils/mocks/room.js"

router.get(
  "/room/:id",
  (req, res) => {
    const id =
      Number(req.params.id);

       
    const room =
      getRoom(id);

      
   
    res.json(room);
  }
);
export default router;