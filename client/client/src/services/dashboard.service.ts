import { supabase } from "../lib/supabase";

export async function getIntegrations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}