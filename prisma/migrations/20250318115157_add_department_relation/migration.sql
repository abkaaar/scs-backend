-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "matricNumber" TEXT,
    "password" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "verificationCode" TEXT,
    "verificationCodeExpire" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departmentId" TEXT,
    CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "matricNumber", "password", "phoneNumber", "resetPasswordExpire", "resetPasswordToken", "role", "verificationCode", "verificationCodeExpire") SELECT "createdAt", "email", "id", "matricNumber", "password", "phoneNumber", "resetPasswordExpire", "resetPasswordToken", "role", "verificationCode", "verificationCodeExpire" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_matricNumber_key" ON "User"("matricNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
