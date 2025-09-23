// Lightweight Prisma client stub for environments where @prisma/client is not installed.
// Replace with the real Prisma client when running against a database.

type PrismaMock = {
  $connect: () => Promise<never>;
};

export const prisma: PrismaMock = {
  async $connect() {
    throw new Error('Prisma client is not available in this test environment.');
  },
};
