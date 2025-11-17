import { comparePassword } from "../server/auth";
import { DbStorage } from "../server/storage";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error("Usage: tsx scripts/check_login.ts <email> <password>");
    process.exit(1);
  }
  const storage = new DbStorage();
  const user = await storage.getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    console.log("user_not_found");
    return;
  }
  const ok = await comparePassword(password, user.password);
  console.log("user:", { id: user.id, email: user.email, role: user.role });
  console.log("password_match:", ok);
}

main().catch((e) => { console.error(e); process.exit(1); });
