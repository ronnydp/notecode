import { Router } from "express";
import db from "../firebase.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "NOTE CODE" });
});

router.post("/", async (req, res) => {
  const { code, language, theme} = req.body;
  const doc = await db.collection("notecode").add({
    code,
    language,
    theme
  });

  res.json(doc.id);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const doc = await db.collection('notecode').doc(id).get();
  const data = doc.data();
  const editor = {
    title: "NOTE CODE",
    code: data.code,
    language: data.language,
    theme: data.theme
  }
  res.render("sharedEditor", editor);
});

export default router;
