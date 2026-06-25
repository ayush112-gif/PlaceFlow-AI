require("dotenv").config();

const express = require("express");
const cors = require("cors");
const emailRoutes =
require("./routes/email.routes");

const dashboardRoutes =
require("./routes/dashboard.routes");
const integrationRoutes =
require("./routes/integration.routes");
const studentRoutes =
require("./routes/student.routes");
const noticeRoutes = require("./routes/notice.routes");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cors());

console.log("Registering routes...");

app.use(
  "/api/students",
  studentRoutes
);
console.log("✓ Students route registered at /api/students");

app.use(express.json());
app.use("/api/email", emailRoutes);
console.log("✓ Email route registered at /api/email");

app.use(
  "/api/drafts",
  require("./routes/draft.routes")
);
console.log("✓ Drafts route registered at /api/drafts");

 app.use(
  "/api/draft-storage",
  require("./routes/draft-storage.routes")
);
console.log("✓ Draft-storage route registered at /api/draft-storage");

app.use(
 "/api/email",
 require("./routes/email.routes")
);

app.use(
 "/api/email",
 require(
  "./routes/email.routes"
 )
);

app.use(
  "/api/notice",
  noticeRoutes
);
console.log("✓ Notice route registered at /api/notice");

app.use(
 "/api/dashboard",
  dashboardRoutes
);
console.log("✓ Dashboard route registered at /api/dashboard");

app.use(
  "/api/integrations",
  integrationRoutes
);
console.log("✓ Integration route registered at /api/integrations");

// Templates routes
app.use(
  "/api/templates",
  require("./routes/template.routes")
);
console.log("✓ Templates route registered at /api/templates");

app.get("/", (req, res) => {
  res.send("API Running");
});

console.log(
  "OPENROUTER KEY:",
  process.env.OPENROUTER_API_KEY
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});