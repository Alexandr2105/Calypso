-- CreateTable
CREATE TABLE "Payments" (
    "userId" TEXT NOT NULL,
    "paymentsId" TEXT NOT NULL,
    "dateOfPayments" TIMESTAMP(3) NOT NULL,
    "endDateOfSubscripion" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "subsripionType" TEXT NOT NULL,
    "paymentsType" TEXT NOT NULL,
    "allDataPayments" JSONB NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("userId")
);
