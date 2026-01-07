import path from "node:path";
import fs from "node:fs";
import app from "./app";
import config from "./config/env";

const PORT = config.PORT;

const envPath = path.resolve(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.warn("⚠️  Warning: .env file not found!");
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
