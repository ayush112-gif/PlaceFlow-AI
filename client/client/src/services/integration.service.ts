import { supabase } from "../lib/supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Validate integration credentials with the backend
 * Performs credential validation before saving
 */
export async function validateIntegration(payload: any) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch(`${API_BASE}/api/integrations/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      provider: payload.provider,
      config: payload,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to validate integration");
  }

  return result;
}

/**
 * Save integration without validation (use validateIntegration first)
 * Stores the configuration in the database
 */
export async function saveIntegration(payload: any) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const response = await fetch(`${API_BASE}/api/integrations/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      provider: payload.provider,
      config: payload,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to save integration");
  }

  return result;
}

/**
 * Fetch all integrations for the current user
 * Returns array of integration configurations
 */
export async function getIntegrations() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;

  return data;
}

/**
 * Fetch a specific integration by provider
 * Returns the integration config or null if not found
 */
export async function getIntegration(provider: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .maybeSingle();

  if (error) return null;

  return data;
}

/**
 * Delete an integration by provider
 * Removes the configuration from the database
 */
export async function deleteIntegration(provider: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { error } = await supabase
    .from("integrations")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);

  if (error) throw error;

  return true;
}