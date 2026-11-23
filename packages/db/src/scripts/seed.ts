import { prisma } from "..";
import { Prisma } from "../../generated/prisma/client";
import { randomUUID } from "node:crypto";

(async () => {
  try {
    const products: Prisma.ProductCreateManyInput[] = [
      {
        id: randomUUID().toString(),
        name: "T-shirt",
        description: "T-shirt description here...",
        isActive: true,
        price: new Prisma.Decimal("4.30"),
        stock: 5,
      },
      {
        id: randomUUID().toString(),
        name: "Hoodie",
        description: "Hoodie description here...",
        isActive: true,
        price: new Prisma.Decimal("29.99"),
        stock: 12,
      },
      {
        id: randomUUID().toString(),
        name: "Cap",
        description: "Cap description here...",
        isActive: true,
        price: new Prisma.Decimal("14.50"),
        stock: 24,
      },
      {
        id: randomUUID().toString(),
        name: "Mug",
        description: "Mug description here...",
        isActive: true,
        price: new Prisma.Decimal("9.99"),
        stock: 40,
      },
      {
        id: randomUUID().toString(),
        name: "Sticker Pack",
        description: "Sticker Pack description here...",
        isActive: true,
        price: new Prisma.Decimal("3.25"),
        stock: 100,
      },
      {
        id: randomUUID().toString(),
        name: "Desktop pad",
        description: "Desktop pad description here...",
        isActive: true,
        price: new Prisma.Decimal("3.25"),
        stock: 0,
      },
    ];
    const res = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    if (res.count > 0) {
      console.log(`[SEED-COMPLETE]: ${res.count} Products added to DB`);
    }
  } catch (error) {
    console.log("[SEED-ERROR]: ", error);
  } finally {
    await prisma.$disconnect();
  }
})();
