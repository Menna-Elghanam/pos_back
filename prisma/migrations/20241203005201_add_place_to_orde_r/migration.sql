/*
  Warnings:

  - The values [DINE_IN] on the enum `Order_orderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `orderType` ENUM('PLACE', 'TAKEAWAY', 'DELIVERY') NOT NULL;
