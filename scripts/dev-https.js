/* eslint-env node */
/* global process */
import fs from "fs";
import path from "path";
import { createServer } from "vite";

// Expect cert/key files in the project root:
//   - key.pem
//   - cert.pem
const KEY_PATH = path.resolve("key.pem");
const CERT_PATH = path.resolve("cert.pem");

function readHttpsConfig() {
  const hasKey = fs.existsSync(KEY_PATH);
  const hasCert = fs.existsSync(CERT_PATH);

  if (!hasKey || !hasCert) {
    const relKey = path.relative(process.cwd(), KEY_PATH) || "key.pem";
    const relCert = path.relative(process.cwd(), CERT_PATH) || "cert.pem";
    console.error(
      [
        "🔒 HTTPS cert/key not found.",
        `Expected files in project root (or current working directory):`,
        `  - ${relKey}`,
        `  - ${relCert}`,
        "",
        "Create them with mkcert (recommended):",
        '  mkcert -install',
        `  mkcert -key-file key.pem \\`,
        `         -cert-file cert.pem \\`,
        '         "localhost" "127.0.0.1" "::1"',
        "",
        "Then rerun: npm run dev:https",
      ].join("\n")
    );
    process.exit(1);
  }

  return {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
  };
}

async function start() {
  const server = await createServer({
    server: {
      host: true, // listen on LAN so iOS devices can reach it
      https: readHttpsConfig(),
    },
  });

  await server.listen();
  server.printUrls();
  console.log(
    [
      "",
      "If testing on a phone: use the LAN URL above and ensure the device trusts the mkcert root CA.",
      "On iOS/macOS with mkcert: run `mkcert -install` and open the generated root CA to trust it.",
    ].join("\n")
  );
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

