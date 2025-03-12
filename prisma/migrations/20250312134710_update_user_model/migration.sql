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
    "LoginToken" TEXT,
    "LoginExpire" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "password", "resetPasswordExpire", "resetPasswordToken", "role") SELECT "createdAt", "email", "id", "password", "resetPasswordExpire", "resetPasswordToken", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_matricNumber_key" ON "User"("matricNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
