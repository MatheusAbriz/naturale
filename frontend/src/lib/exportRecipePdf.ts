import { jsPDF } from "jspdf";
import type { Posts } from "@/types/posts";

const MARGIN = 14;
const MAX_WIDTH = 180;

export function exportRecipePdf(post: Posts) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(post.title, MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Tempo de preparo: ${post.time}`, MARGIN, y);
  y += 10;

  const ingredients = post.ingredients
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  if (ingredients.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Ingredientes", MARGIN, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    for (const ingredient of ingredients) {
      doc.text(`• ${ingredient}`, MARGIN, y);
      y += 6;
    }
    y += 4;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Modo de preparo", MARGIN, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const textLines = doc.splitTextToSize(post.text, MAX_WIDTH);
  doc.text(textLines, MARGIN, y);

  doc.save(`${post.title}.pdf`);
}
