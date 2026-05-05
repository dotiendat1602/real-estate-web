import fs from "node:fs";
import net from "node:net";

const port = Number(process.env.PORT || 3000);

function isPortOpen(portNumber) {
  return new Promise((resolve) => {
    const socket = net.createConnection({
      host: "127.0.0.1",
      port: portNumber,
    });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

if (await isPortOpen(port)) {
  console.error(
    `Port ${port} is already in use. Stop the running Next dev/start server before building to avoid .next corruption or a hanging build.`
  );
  process.exit(1);
}

fs.rmSync(".next", { recursive: true, force: true });
