import { setup } from "./setup.js";
import { transfer } from "./transfer.js";

async function main() {
  await setup();
  await transfer(101, 102, 1000, "Transfer 1000 from 101 to 102");
}

main().catch(console.error);
