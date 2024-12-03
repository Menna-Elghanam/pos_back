/*
  Warnings:

  - The values [in_place,delivery] on the enum `Order_orderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `orderType` ENUM('DINE_IN', 'TAKEAWAY', 'DELIVERY') NOT NULL;
