-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "GenderTarget" AS ENUM ('UNISEX', 'MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "NoteCategory" AS ENUM ('TOP', 'HEART', 'BASE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "recommendationCredits" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fragrance_notes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "fragrance_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfumes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gender" "GenderTarget" NOT NULL DEFAULT 'UNISEX',
    "priceRange" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "imageUrl" TEXT NOT NULL,
    "seasonSummer" INTEGER NOT NULL DEFAULT 5,
    "seasonWinter" INTEGER NOT NULL DEFAULT 5,
    "seasonSpring" INTEGER NOT NULL DEFAULT 5,
    "seasonAutumn" INTEGER NOT NULL DEFAULT 5,
    "occasionOffice" INTEGER NOT NULL DEFAULT 5,
    "occasionDateNight" INTEGER NOT NULL DEFAULT 5,
    "occasionCasual" INTEGER NOT NULL DEFAULT 5,
    "occasionParty" INTEGER NOT NULL DEFAULT 5,
    "amazonUrl" TEXT,
    "flipkartUrl" TEXT,
    "officialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_notes" (
    "id" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "type" "NoteCategory" NOT NULL,

    CONSTRAINT "perfume_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "rawPrompt" TEXT,
    "parsedPreferences" JSONB NOT NULL,
    "recommendedIds" TEXT[],
    "aiExplanation" TEXT,
    "feedbackRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentMethod" TEXT NOT NULL,
    "paymentId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "creditsAdded" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "fragrance_notes_name_key" ON "fragrance_notes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fragrance_notes_slug_key" ON "fragrance_notes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_slug_key" ON "perfumes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_notes_perfumeId_noteId_type_key" ON "perfume_notes"("perfumeId", "noteId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_userId_perfumeId_key" ON "wishlists"("userId", "perfumeId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_paymentId_key" ON "payment_transactions"("paymentId");

-- AddForeignKey
ALTER TABLE "perfumes" ADD CONSTRAINT "perfumes_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfume_notes" ADD CONSTRAINT "perfume_notes_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfume_notes" ADD CONSTRAINT "perfume_notes_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "fragrance_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_perfumeId_fkey" FOREIGN KEY ("perfumeId") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_logs" ADD CONSTRAINT "recommendation_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
