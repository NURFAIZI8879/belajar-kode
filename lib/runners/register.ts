import { registerRunner } from "./index";
import { sqlAdapter } from "./sql-runner";
import { pythonAdapter } from "./python-runner";

registerRunner("sql", () => Promise.resolve(sqlAdapter));
registerRunner("python", () => Promise.resolve(pythonAdapter));
