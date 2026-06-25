import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { supabase } from "../lib/supabase";

import {
  getEmailLogs
} from "../services/emailLog.service";

export default function EmailLogs() {

  const [logs, setLogs] =
    useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const data =
      await getEmailLogs(
        user.id
      );

    setLogs(data);
  }

  return (
    <DashboardLayout>

      <h1>
        Email Logs
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse:
            "collapse"
        }}
      >
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Recipients</th>
            <th>Status</th>
            <th>Provider</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {logs.map(
            (log: any) => (

              <tr
                key={log.id}
              >
                <td>
                  {log.company}
                </td>

                <td>
                  {log.role}
                </td>

                <td>
                  {
                    log.recipients_count
                  }
                </td>

                <td>
                  {log.status}
                </td>

                <td>
                  {log.provider}
                </td>

                <td>
                  {new Date(
                    log.created_at
                  ).toLocaleString()}
                </td>
              </tr>

            )
          )}

        </tbody>

      </table>

    </DashboardLayout>
  );
}