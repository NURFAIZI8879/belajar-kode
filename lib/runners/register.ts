import { registerRunner } from "./index";
import { pythonAdapter } from "./python-runner";
import { createWandboxAdapter } from "./wandbox-adapter";

registerRunner("python", () => Promise.resolve(pythonAdapter));
registerRunner("c", () => Promise.resolve(createWandboxAdapter("c")));
registerRunner("cpp", () => Promise.resolve(createWandboxAdapter("cpp")));
registerRunner("csharp", () => Promise.resolve(createWandboxAdapter("csharp")));
registerRunner("php", () => Promise.resolve(createWandboxAdapter("php")));