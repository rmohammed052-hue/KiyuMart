import 'dotenv/config';
import { db } from "../db";
import { 
  users, products, categories, stores, deliveryZones, 
  platformSettings, orders, orderItems, cart, wishlist,
  reviews, notifications, chatMessages, transactions,
  deliveryTracking, coupons, heroBanners, productVariants
} from "@shared/schema";
import { hashPassword } from "../server/auth";

async function wipeDatabase() {
  console.log("🗑️  Wiping all data...");
  
  // Delete in correct order to respect foreign key constraints
  await db.delete(deliveryTracking);
  await db.delete(chatMessages);
  await db.delete(notifications);
  await db.delete(reviews);
  await db.delete(productVariants);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(transactions);
  await db.delete(wishlist);
  await db.delete(cart);
  await db.delete(coupons);
  await db.delete(heroBanners);
  await db.delete(products);
  await db.delete(stores);
  await db.delete(deliveryZones);
  await db.delete(categories);
  await db.delete(users);
  
  console.log("✅ All data wiped successfully");
}

async function seedMinimalData() {
  console.log("🌱 Starting minimal seed for real-world testing...");

  // 1. Create admin user with working password
  console.log("Creating admin user...");
  const adminPassword = await hashPassword("admin123");
  const [admin] = await db.insert(users).values({
    email: "admin@kiyumart.com",
    password: adminPassword,
    name: "System Admin",
    role: "admin",
    phone: "+233244000001",
    isActive: true,
    isApproved: true,
  }).returning();
  console.log("✅ Admin created:", admin.email);

  // 1a. Create super admin user (platform owner)
  console.log("Creating super admin user...");
  const superAdminPassword = await hashPassword("superadmin123");
  const [superAdmin] = await db.insert(users).values({
    email: "superadmin@kiyumart.com",
    password: superAdminPassword,
    name: "Platform Owner",
    role: "super_admin",
    phone: "+233244000000",
    isActive: true,
    isApproved: true,
  }).returning();
  console.log("✅ Super Admin created:", superAdmin.email);

  // 2. Create 2 sellers with different store types
  console.log("\nCreating 2 sellers...");
  const seller1Password = await hashPassword("seller123");
  const [seller1] = await db.insert(users).values({
    email: "seller1@kiyumart.com",
    password: seller1Password,
    name: "Fashion Store Owner",
    role: "seller",
    phone: "+233244111111",
    isActive: true,
    isApproved: true,
    storeName: "ModestGlow Fashion",
    storeDescription: "Premium Islamic fashion and modest wear",
    storeType: "clothing",
    businessAddress: "Accra Central, Ghana",
  }).returning();

  const [seller2] = await db.insert(users).values({
    email: "seller2@kiyumart.com",
    password: seller1Password, // same password for simplicity
    name: "Beauty Shop Owner",
    role: "seller",
    phone: "+233244222222",
    isActive: true,
    isApproved: true,
    storeName: "Beauty Essentials",
    storeDescription: "Natural beauty products and cosmetics",
    storeType: "beauty_cosmetics",
    businessAddress: "Kumasi, Ghana",
  }).returning();
  console.log("✅ Sellers created:", seller1.email, seller2.email);

  // 3. Create stores for sellers
  console.log("\nCreating stores...");
  const [store1] = await db.insert(stores).values({
    primarySellerId: seller1.id,
    name: seller1.storeName!,
    description: seller1.storeDescription!,
    storeType: seller1.storeType!,
    isActive: true,
    isApproved: true,
  }).returning();

  const [store2] = await db.insert(stores).values({
    primarySellerId: seller2.id,
    name: seller2.storeName!,
    description: seller2.storeDescription!,
    storeType: seller2.storeType!,
    isActive: true,
    isApproved: true,
  }).returning();
  console.log("✅ Stores created:", store1.name, store2.name);

  // 4. Create categories
  console.log("\nCreating categories...");
  const [fashionCat] = await db.insert(categories).values({
    name: "Women's Clothing",
    slug: "womens-clothing",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
    description: "Modest and fashionable clothing for women",
    storeTypes: ["clothing"],
    isActive: true,
    displayOrder: 1,
  }).returning();

  const [beautyCat] = await db.insert(categories).values({
    name: "Beauty & Cosmetics",
    slug: "beauty-cosmetics",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    description: "Natural beauty products and cosmetics",
    storeTypes: ["beauty_cosmetics"],
    isActive: true,
    displayOrder: 2,
  }).returning();
  console.log("✅ Categories created");

  // 5. Create 3 products for each seller
  console.log("\nCreating products...");
  
  // Seller 1 products (Fashion)
  await db.insert(products).values([
    {
      sellerId: seller1.id,
      storeId: store1.id,
      name: "Premium Abaya - Black",
      description: "Elegant black abaya with intricate embroidery. Made from high-quality fabric for comfort and style.",
      categoryId: fashionCat.id,
      price: "120.00",
      costPrice: "60.00",
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
        "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoDuration: 15,
      isActive: true,
    },
    {
      sellerId: seller1.id,
      storeId: store1.id,
      name: "Silk Hijab Collection - 5 Pack",
      description: "Premium silk hijabs in assorted colors. Soft, breathable, and perfect for daily wear.",
      categoryId: fashionCat.id,
      price: "45.00",
      costPrice: "20.00",
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      videoDuration: 20,
      isActive: true,
    },
    {
      sellerId: seller1.id,
      storeId: store1.id,
      name: "Modest Maxi Dress - Navy Blue",
      description: "Beautiful navy blue maxi dress perfect for any occasion. Comfortable fit with elegant design.",
      categoryId: fashionCat.id,
      price: "85.00",
      costPrice: "40.00",
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
        "https://images.unsplash.com/photo-1582552938357-32b906d81089?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      videoDuration: 30,
      isActive: true,
    },
  ]);

  // Seller 2 products (Beauty)
  await db.insert(products).values([
    {
      sellerId: seller2.id,
      storeId: store2.id,
      name: "Natural Face Cream - Shea Butter",
      description: "100% natural face cream made with organic shea butter. Moisturizes and nourishes all skin types.",
      categoryId: beautyCat.id,
      price: "35.00",
      costPrice: "15.00",
      stock: 100,
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      videoDuration: 25,
      isActive: true,
    },
    {
      sellerId: seller2.id,
      storeId: store2.id,
      name: "Organic Lip Balm Set - 3 Flavors",
      description: "Natural lip balm set with vanilla, strawberry, and mint flavors. Keeps lips soft and hydrated.",
      categoryId: beautyCat.id,
      price: "18.00",
      costPrice: "8.00",
      stock: 150,
      images: [
        "https://images.unsplash.com/photo-1590156221191-5a2b4e0c3778?w=500",
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500",
        "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500",
        "https://images.unsplash.com/photo-1617897903246-719242758050?w=500",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      videoDuration: 18,
      isActive: true,
    },
    {
      sellerId: seller2.id,
      storeId: store2.id,
      name: "Argan Oil Hair Serum",
      description: "Pure Moroccan argan oil hair serum. Repairs damaged hair and adds natural shine.",
      categoryId: beautyCat.id,
      price: "42.00",
      costPrice: "20.00",
      stock: 75,
      images: [
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
      ],
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      videoDuration: 30,
      isActive: true,
    },
  ]);
  console.log("✅ 6 products created (3 per seller)");

  // 6. Create 3 riders for testing delivery assignment
  console.log("\nCreating 3 riders...");
  const riderPassword = await hashPassword("rider123");
  
  const [rider1] = await db.insert(users).values({
    email: "rider1@kiyumart.com",
    password: riderPassword,
    name: "Kwame Mensah",
    role: "rider",
    phone: "+233244333001",
    isActive: true,
    isApproved: true,
    vehicleInfo: {
      type: "Motorcycle",
      plateNumber: "GR-1234-21",
      license: "DL-ACC-001",
      color: "Red",
    },
    businessAddress: "Accra, Ghana",
  }).returning();

  const [rider2] = await db.insert(users).values({
    email: "rider2@kiyumart.com",
    password: riderPassword,
    name: "Abena Osei",
    role: "rider",
    phone: "+233244333002",
    isActive: true,
    isApproved: true,
    vehicleInfo: {
      type: "Motorcycle",
      plateNumber: "AS-5678-21",
      license: "DL-KUM-002",
      color: "Blue",
    },
    businessAddress: "Kumasi, Ghana",
  }).returning();

  const [rider3] = await db.insert(users).values({
    email: "rider3@kiyumart.com",
    password: riderPassword,
    name: "Kofi Antwi",
    role: "rider",
    phone: "+233244333003",
    isActive: true,
    isApproved: true,
    vehicleInfo: {
      type: "Motorcycle",
      plateNumber: "GT-9012-21",
      license: "DL-TML-003",
      color: "Black",
    },
    businessAddress: "Tamale, Ghana",
  }).returning();
  console.log("✅ 3 riders created:", rider1.name, rider2.name, rider3.name);

  // 7. Create 1 buyer for testing calls and orders
  console.log("\nCreating 1 buyer...");
  const buyerPassword = await hashPassword("buyer123");
  const [buyer] = await db.insert(users).values({
    email: "buyer@kiyumart.com",
    password: buyerPassword,
    name: "Ama Asante",
    role: "buyer",
    phone: "+233244555001",
    isActive: true,
    isApproved: true,
  }).returning();
  console.log("✅ Buyer created:", buyer.email);

  // 8. Create delivery zones across Ghana
  console.log("\nCreating delivery zones...");
  await db.insert(deliveryZones).values([
    { name: "Accra", fee: "10.00", isActive: true },
    { name: "Kumasi", fee: "15.00", isActive: true },
    { name: "Tamale", fee: "20.00", isActive: true },
    { name: "Cape Coast", fee: "12.00", isActive: true },
    { name: "Takoradi", fee: "18.00", isActive: true },
  ]);
  console.log("✅ Delivery zones created");

  // 9. Update platform settings for multi-vendor mode
  console.log("\nUpdating platform settings...");
  await db.update(platformSettings).set({
    isMultiVendor: true,
    allowSellerRegistration: true,
    allowRiderRegistration: true,
    platformName: "KiyuMart Ghana",
    contactAddress: "Accra, Ghana",
    defaultCurrency: "GHS",
  });
  console.log("✅ Platform configured for multi-vendor mode");

  console.log("\n✨ Minimal seed complete!");
  console.log("\n📋 Test Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin: superadmin@kiyumart.com / superadmin123");
  console.log("Admin:    admin@kiyumart.com / admin123");
  console.log("Seller 1: seller1@kiyumart.com / seller123");
  console.log("Seller 2: seller2@kiyumart.com / seller123");
  console.log("Rider 1:  rider1@kiyumart.com / rider123");
  console.log("Rider 2:  rider2@kiyumart.com / rider123");
  console.log("Rider 3:  rider3@kiyumart.com / rider123");
  console.log("Buyer:    buyer@kiyumart.com / buyer123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

async function main() {
  try {
    await wipeDatabase();
    await seedMinimalData();
    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
