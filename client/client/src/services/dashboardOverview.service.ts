import axios from "axios";
import { supabase } from "../lib/supabase";

export async function getDashboardOverview() {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found");
      return {
        students: 0,
        drafts: 0,
        emails: 0,
        integrations: [],
        recentLogs: []
      };
    }

    console.log("Fetching dashboard for user:", user.id);
    
    const res = await axios.get(
      `https://placeflow-ai.onrender.com/api/dashboard/overview/${user.id}`,
      { timeout: 5000 }
    );

    console.log("Dashboard API response:", res.status, res.data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch dashboard overview:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Error:", error.message);
    
    return {
      students: 0,
      drafts: 0,
      emails: 0,
      integrations: [],
      recentLogs: []
    };
  }
}