import { supabase } from "../lib/supabase";

export async function createWorkspace(
  userId: string,
  email: string
) {
  const workspaceName =
    email.split("@")[0] + "'s Workspace";

  const { data: workspace, error: workspaceError } =
    await supabase
      .from("workspaces")
      .insert({
        name: workspaceName,
      })
      .select()
      .single();

  if (workspaceError) {
    throw workspaceError;
  }

  const { error: profileError } =
    await supabase
      .from("profiles")
      .insert({
        id: userId,
        workspace_id: workspace.id,
        email,
        full_name: "",
      });

  if (profileError) {
    throw profileError;
  }

  return workspace;
}