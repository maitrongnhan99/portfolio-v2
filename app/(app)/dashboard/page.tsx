import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to the assistant page as the main admin page
  redirect("/dashboard/assistant");
}