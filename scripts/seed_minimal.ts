import { db } from "../db/index";
import { users, products } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seedMinimal() {
  console.log("🧹 Wiping all users and products...");
  await db.delete(products);
  await db.delete(users);

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Seed 2 sellers
  const sellers = [];
  for (let i = 0; i < 2; i++) {
    const [seller] = await db.insert(users).values({
      email: `seller${i + 1}@kiyumart.com`,
      password: hashedPassword,
      name: `Seller ${i + 1}`,
      role: "seller",
      phone: `+233${2400000000 + i}`,
      storeType: i === 0 ? "clothing" : "electronics",
      storeName: `Store ${i + 1}`,
      businessAddress: `${i + 1} Market Street, Accra, Ghana`,
      isApproved: true,
      profileImage: `https://res.cloudinary.com/demo/image/upload/sample.jpg`
    }).returning();
    sellers.push(seller);
  }

  // Seed 3 riders
  for (let i = 0; i < 3; i++) {
    await db.insert(users).values({
      email: `rider${i + 1}@kiyumart.com`,
      password: hashedPassword,
      name: `Rider ${i + 1}`,
      role: "rider",
      phone: `+233${2500000000 + i}`,
      vehicleInfo: { type: i % 2 === 0 ? "motorcycle" : "bicycle", plateNumber: `GH-${1000 + i}` },
      isApproved: true,
      profileImage: `https://res.cloudinary.com/demo/image/upload/sample.jpg`
    });
  }

  // Seed 1 buyer
  await db.insert(users).values({
    email: "buyer1@kiyumart.com",
    password: hashedPassword,
    name: "Buyer 1",
    role: "buyer",
    phone: "+2332600000001",
    isApproved: true,
    profileImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  });

  // Seed 3 products for each seller
  for (let i = 0; i < sellers.length; i++) {
    for (let j = 0; j < 3; j++) {
      await db.insert(products).values({
        name: `Product ${j + 1} for Seller ${i + 1}`,
        description: `Description for product ${j + 1} of seller ${i + 1}`,
        price: 100 * (j + 1),
        sellerId: sellers[i].id,
        category: sellers[i].storeType,
        image: `https://res.cloudinary.com/demo/image/upload/sample.jpg`,
        isActive: true
      });
    }
  }

  console.log("✅ Minimal seed complete: 2 sellers, 3 riders, 1 buyer, 6 products.");
}

seedMinimal().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
