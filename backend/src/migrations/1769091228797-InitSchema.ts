import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1769091228797 implements MigrationInterface {
  name = 'InitSchema1769091228797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`PermissionCode\` varchar(100) NOT NULL, \`Description\` varchar(255) NULL, UNIQUE INDEX \`IDX_661a09c0345da070d30e3ccee5\` (\`PermissionCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`RoleID\` int NOT NULL, \`PermissionID\` int NOT NULL, UNIQUE INDEX \`IDX_8b981c4b69a22595b998831c22\` (\`RoleID\`, \`PermissionID\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Application_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`RoleName\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_189df745b53983163422ea6c2d\` (\`RoleName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`UserID\` varchar(255) NOT NULL, \`RoleID\` int NOT NULL, UNIQUE INDEX \`IDX_7cb66c0b954e4b05d3e2d8ced0\` (\`UserID\`, \`RoleID\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Application_User\` (\`id\` varchar(36) NOT NULL, \`userName\` varchar(255) NULL, \`normalizedUserName\` varchar(255) NULL, \`email\` varchar(255) NULL, \`normalizedEmail\` varchar(255) NULL, \`emailConfirmed\` tinyint NOT NULL DEFAULT 0, \`passwordHash\` varchar(255) NULL, \`securityStamp\` varchar(255) NULL, \`concurrencyStamp\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`phoneNumberConfirmed\` tinyint NOT NULL DEFAULT 0, \`twoFactorEnabled\` tinyint NOT NULL DEFAULT 0, \`lockoutEnd\` timestamp NULL, \`lockoutEnabled\` tinyint NOT NULL DEFAULT 1, \`accessFailedCount\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`TenantID\` int NOT NULL, \`BranchID\` int NULL, \`FullName\` varchar(255) NOT NULL, \`IsActive\` tinyint NOT NULL DEFAULT 1, \`LastLogin\` timestamp NULL, UNIQUE INDEX \`IDX_0446ae249022783bc1f9066a7d\` (\`userName\`), UNIQUE INDEX \`IDX_de098fa25154ac41cefe250e39\` (\`normalizedUserName\`), UNIQUE INDEX \`IDX_d27a5281b0208581289efda69f\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`branches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`BranchName\` varchar(255) NOT NULL, \`Address\` varchar(500) NOT NULL, \`ContactNo\` varchar(50) NOT NULL, \`IsActive\` tinyint NOT NULL DEFAULT 1, \`TenantID\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tenants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`TenantName\` varchar(255) NOT NULL, \`Code\` varchar(255) NOT NULL, \`Name\` varchar(255) NOT NULL, \`SubscriptionPlan\` varchar(100) NOT NULL, \`IsActive\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`journal_entries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`referenceType\` enum ('SALE', 'REFUND', 'ADJUSTMENT') NOT NULL, \`referenceId\` int NOT NULL, \`postedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`tenantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`journal_lines\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`debit\` decimal(15,2) NOT NULL DEFAULT '0.00', \`credit\` decimal(15,2) NOT NULL DEFAULT '0.00', \`journalEntryId\` int NOT NULL, \`accountId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`accountCode\` varchar(50) NOT NULL, \`accountName\` varchar(150) NOT NULL, \`accountType\` enum ('ASSET', 'LIABILITY', 'INCOME', 'EXPENSE') NOT NULL, \`tenantId\` int NOT NULL, UNIQUE INDEX \`IDX_727413b70cc2beb4c1429e8193\` (\`tenantId\`, \`accountCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`audit_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`action\` varchar(255) NOT NULL, \`entityName\` varchar(255) NOT NULL, \`entityId\` varchar(255) NOT NULL, \`oldValue\` text NULL, \`newValue\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cash_sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`openingBalance\` decimal(15,2) NOT NULL DEFAULT '0.00', \`closingBalance\` decimal(15,2) NULL, \`expectedBalance\` decimal(15,2) NULL, \`variance\` decimal(15,2) NULL, \`openedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`closedAt\` timestamp NULL, \`status\` enum ('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN', \`tenantId\` int NOT NULL, \`branchId\` int NOT NULL, \`cashierId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cash_movements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`movementType\` enum ('SALE', 'REFUND', 'DROP', 'PAYOUT') NOT NULL, \`amount\` decimal(15,2) NOT NULL, \`referenceNo\` varchar(100) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`sessionId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`TenantID\` int NOT NULL, \`CategoryName\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_0974f4d322dd49c7e5c505e0b1\` (\`TenantID\`, \`CategoryName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`fullName\` varchar(255) NOT NULL, \`contactNo\` varchar(255) NULL, \`email\` varchar(255) NULL, \`loyaltyPoints\` int NOT NULL DEFAULT '0', \`tenantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`TenantID\` int NOT NULL, \`CategoryID\` int NOT NULL, \`SKU\` varchar(100) NOT NULL, \`ProductName\` varchar(255) NOT NULL, \`Description\` text NULL, \`IsActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_4fdb91873f715304302b6d914e\` (\`TenantID\`, \`SKU\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_variants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`barcode\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`costPrice\` decimal(10,2) NOT NULL, \`sellingPrice\` decimal(10,2) NOT NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`quantityOnHand\` int NOT NULL DEFAULT '0', \`reorderLevel\` int NOT NULL DEFAULT '0', \`variantId\` int NULL, \`branchId\` int NULL, UNIQUE INDEX \`IDX_9bb0ac4d4e3c9dc0243e5633c1\` (\`variantId\`, \`branchId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_count_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`systemQty\` int NOT NULL, \`countedQty\` int NOT NULL, \`variance\` int NOT NULL, \`inventoryCountId\` int NOT NULL, \`variantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_counts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`countDate\` date NOT NULL, \`status\` enum ('DRAFT', 'POSTED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT', \`branchId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`inventory_movements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`movementType\` enum ('IN', 'OUT', 'ADJUSTMENT') NOT NULL, \`quantity\` int NOT NULL, \`referenceNo\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`variantId\` int NULL, \`branchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`stock_batches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`costPrice\` decimal(15,2) NOT NULL, \`quantity\` int NOT NULL, \`expiryDate\` date NULL, \`variantId\` int NOT NULL, \`branchId\` int NOT NULL, INDEX \`IDX_6604d6568a676d40af02c34464\` (\`variantId\`, \`branchId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pos_devices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`deviceCode\` varchar(50) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`lastSyncAt\` timestamp NULL, \`branchId\` int NOT NULL, UNIQUE INDEX \`IDX_d05b4d04cf6279f9ea50e8cb12\` (\`branchId\`, \`deviceCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shifts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`startTime\` timestamp NOT NULL, \`endTime\` timestamp NULL, \`branchId\` int NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_163f54d15524000ed096c2f9a1\` (\`branchId\`, \`startTime\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`price_list_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`sellingPrice\` decimal(15,2) NOT NULL, \`priceListId\` int NOT NULL, \`variantId\` int NOT NULL, UNIQUE INDEX \`IDX_4062555582e2235d62029e0b83\` (\`priceListId\`, \`variantId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`price_lists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`effectiveFrom\` date NOT NULL, \`effectiveTo\` date NULL, \`tenantId\` int NOT NULL, \`branchId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`promotion_rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`discountValue\` decimal(15,2) NOT NULL, \`promotionId\` int NOT NULL, \`variantId\` int NOT NULL, UNIQUE INDEX \`IDX_a9258b189219dc7fe9ab8faf34\` (\`promotionId\`, \`variantId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`promotions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`type\` enum ('PERCENT', 'FIXED') NOT NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, \`tenantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`paymentMethod\` enum ('CASH', 'CARD', 'EWALLET') NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`referenceNo\` varchar(255) NULL, \`saleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`taxes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`taxName\` varchar(255) NOT NULL, \`rate\` decimal(5,2) NOT NULL, \`tenantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sale_taxes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`taxAmount\` decimal(12,2) NOT NULL, \`saleId\` int NULL, \`taxId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sale_headers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`receiptNo\` varchar(255) NOT NULL, \`grossAmount\` decimal(12,2) NOT NULL, \`discountAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`taxAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`netAmount\` decimal(12,2) NOT NULL, \`saleDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` enum ('PAID', 'VOIDED', 'REFUNDED') NOT NULL DEFAULT 'PAID', \`tenantId\` int NULL, \`branchId\` int NULL, \`cashierId\` varchar(36) NULL, \`customerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sale_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`quantity\` int NOT NULL, \`unitPrice\` decimal(12,2) NOT NULL, \`lineTotal\` decimal(12,2) NOT NULL, \`saleId\` int NULL, \`variantId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sales_return_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`quantity\` int NOT NULL, \`refundAmount\` decimal(15,2) NOT NULL, \`salesReturnId\` int NOT NULL, \`saleDetailId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sales_returns\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`returnDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`reasonCode\` varchar(50) NOT NULL, \`totalRefund\` decimal(15,2) NOT NULL, \`saleId\` int NOT NULL, \`branchId\` int NOT NULL, \`processedById\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`login_audits\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`ipAddress\` varchar(45) NOT NULL, \`deviceInfo\` text NULL, \`loginTime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` enum ('SUCCESS', 'FAILED', 'LOCKED') NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_3feac0530e3165c7dab1556bfb\` (\`userId\`, \`loginTime\`), INDEX \`IDX_4669e450251cf242492019453d\` (\`loginTime\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`daily_sales_summaries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`salesDate\` date NOT NULL, \`totalSales\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalTax\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalDiscount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`branchId\` int NULL, UNIQUE INDEX \`IDX_e10c2197782c82d966cf2f4749\` (\`branchId\`, \`salesDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tax_rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`taxType\` enum ('VAT', 'LOCAL', 'SERVICE') NOT NULL, \`isInclusive\` tinyint NOT NULL DEFAULT 0, \`roundingRule\` enum ('ROUND', 'CEIL', 'FLOOR') NOT NULL DEFAULT 'ROUND', \`effectiveFrom\` date NOT NULL, \`effectiveTo\` date NULL, \`tenantId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sale_tax_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdById\` varchar(255) NULL, \`createdBy\` varchar(255) NULL, \`lastModifiedById\` varchar(255) NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`taxAmount\` decimal(15,2) NOT NULL, \`saleDetailId\` int NOT NULL, \`taxRuleId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_3e14ecc38e15ecf503d1b3ead37\` FOREIGN KEY (\`RoleID\`) REFERENCES \`Application_role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_8a4678008246639de8d95a313fb\` FOREIGN KEY (\`PermissionID\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_82ace3bcdfdead828dd5e10de50\` FOREIGN KEY (\`UserID\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_09c1dd527bbdf3772ce595d30f0\` FOREIGN KEY (\`RoleID\`) REFERENCES \`Application_role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Application_User\` ADD CONSTRAINT \`FK_7c8ed69e240512f03e8e0580c29\` FOREIGN KEY (\`TenantID\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Application_User\` ADD CONSTRAINT \`FK_acf53534abef10f7268e0b4c7d9\` FOREIGN KEY (\`BranchID\`) REFERENCES \`branches\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`branches\` ADD CONSTRAINT \`FK_136a89f2131f33ae7346ef0b24a\` FOREIGN KEY (\`TenantID\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_entries\` ADD CONSTRAINT \`FK_8ddb19c8d608eda820581b1df72\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_lines\` ADD CONSTRAINT \`FK_3c913ef1f691ce5b2c490116309\` FOREIGN KEY (\`journalEntryId\`) REFERENCES \`journal_entries\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_lines\` ADD CONSTRAINT \`FK_d9eecc536593997a18359db2b47\` FOREIGN KEY (\`accountId\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_400028436681d655ad3cd563540\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`audit_logs\` ADD CONSTRAINT \`FK_cfa83f61e4d27a87fcae1e025ab\` FOREIGN KEY (\`userId\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` ADD CONSTRAINT \`FK_00306b0b5451070efec0280b494\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` ADD CONSTRAINT \`FK_c60a038efb3df6f3e07504fdcd1\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` ADD CONSTRAINT \`FK_bbd26e96daf91c4976137b2aea7\` FOREIGN KEY (\`cashierId\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_movements\` ADD CONSTRAINT \`FK_81294ecc660543c080efcd33265\` FOREIGN KEY (\`sessionId\`) REFERENCES \`cash_sessions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_67404fa0af91edbb4518a117f06\` FOREIGN KEY (\`TenantID\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_37c1a605468d156e6a8f78f1dc5\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_6a5293e75c1c43abb90ce75a4c1\` FOREIGN KEY (\`TenantID\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_981bd4588a5ac92d66345a96837\` FOREIGN KEY (\`CategoryID\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_variants\` ADD CONSTRAINT \`FK_f515690c571a03400a9876600b5\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` ADD CONSTRAINT \`FK_13d90d420ac9dff1231d1ca0100\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` ADD CONSTRAINT \`FK_2014685d316d58cb0051a2a3374\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_count_details\` ADD CONSTRAINT \`FK_dfc3ac9f61c99db956884a31546\` FOREIGN KEY (\`inventoryCountId\`) REFERENCES \`inventory_counts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_count_details\` ADD CONSTRAINT \`FK_a2e1b4b8b5cadd91c2d712d7f7b\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_counts\` ADD CONSTRAINT \`FK_15c8c9a8dcb3d061639011203d9\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_movements\` ADD CONSTRAINT \`FK_d76f5767ea35d4c281d2bcac34f\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_movements\` ADD CONSTRAINT \`FK_279b7a659bd9dc152bfe5922009\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_batches\` ADD CONSTRAINT \`FK_6a01847e73ea757f8205f67ecff\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_batches\` ADD CONSTRAINT \`FK_d122a85da1b918954ddff35de77\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pos_devices\` ADD CONSTRAINT \`FK_c20f0ec191fc266aceb2225cab1\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_f810ae885d5cb2d5748a407a148\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_7862b9a401e0fe7dc5ef96e9116\` FOREIGN KEY (\`userId\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_list_items\` ADD CONSTRAINT \`FK_97f080960141255e54eecb9bdbd\` FOREIGN KEY (\`priceListId\`) REFERENCES \`price_lists\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_list_items\` ADD CONSTRAINT \`FK_62e2bd922d11fc8204172d6789c\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_lists\` ADD CONSTRAINT \`FK_02d8838ac5cd6133a7fff466f43\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_lists\` ADD CONSTRAINT \`FK_31b210a096ef49b460258ecb701\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion_rules\` ADD CONSTRAINT \`FK_601560bbf10d70de1395cb5a5fb\` FOREIGN KEY (\`promotionId\`) REFERENCES \`promotions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion_rules\` ADD CONSTRAINT \`FK_1fa4f95c1c6e798139222e89ee0\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotions\` ADD CONSTRAINT \`FK_d8ab737281d72169a5222615455\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_e15427928c7a02bd304d628c41e\` FOREIGN KEY (\`saleId\`) REFERENCES \`sale_headers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`taxes\` ADD CONSTRAINT \`FK_3b850d0c8c3b744f80f3959a2fe\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_taxes\` ADD CONSTRAINT \`FK_0903dd3224128af6a04c9b1c400\` FOREIGN KEY (\`saleId\`) REFERENCES \`sale_headers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_taxes\` ADD CONSTRAINT \`FK_2d4e5dc3fdb84e7ca7e6cdb8c4c\` FOREIGN KEY (\`taxId\`) REFERENCES \`taxes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` ADD CONSTRAINT \`FK_37c9d7961f0a032d5a40092d72c\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` ADD CONSTRAINT \`FK_79092f35b92737898071717fd01\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` ADD CONSTRAINT \`FK_147da520d8b91d7464681b58904\` FOREIGN KEY (\`cashierId\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` ADD CONSTRAINT \`FK_e1a6584a8c6c8244688b616ee34\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_details\` ADD CONSTRAINT \`FK_d7fef51a6c57924613bdb3980cd\` FOREIGN KEY (\`saleId\`) REFERENCES \`sale_headers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_details\` ADD CONSTRAINT \`FK_87c99e1de7cfc802d0865f57a36\` FOREIGN KEY (\`variantId\`) REFERENCES \`product_variants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_return_details\` ADD CONSTRAINT \`FK_87d45e646f344a8bbe4485c0737\` FOREIGN KEY (\`salesReturnId\`) REFERENCES \`sales_returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_return_details\` ADD CONSTRAINT \`FK_9c97f5e21785db7ea46ccd615c8\` FOREIGN KEY (\`saleDetailId\`) REFERENCES \`sale_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` ADD CONSTRAINT \`FK_84d91a4092b6fc040bd94f338a3\` FOREIGN KEY (\`saleId\`) REFERENCES \`sale_headers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` ADD CONSTRAINT \`FK_0d9934870049bb1fb92811e9d6a\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` ADD CONSTRAINT \`FK_2973b0643a982e66849450a7eb5\` FOREIGN KEY (\`processedById\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`login_audits\` ADD CONSTRAINT \`FK_f76965bf9858a2cab885e064304\` FOREIGN KEY (\`userId\`) REFERENCES \`Application_User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`daily_sales_summaries\` ADD CONSTRAINT \`FK_238871443b024bc173ea32fa315\` FOREIGN KEY (\`branchId\`) REFERENCES \`branches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tax_rules\` ADD CONSTRAINT \`FK_47ae5fd4fe9f25707b6a01578a7\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenants\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_tax_details\` ADD CONSTRAINT \`FK_c192de1316495232e0304238001\` FOREIGN KEY (\`saleDetailId\`) REFERENCES \`sale_details\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_tax_details\` ADD CONSTRAINT \`FK_21e148b470ca04589cccfabedb6\` FOREIGN KEY (\`taxRuleId\`) REFERENCES \`tax_rules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sale_tax_details\` DROP FOREIGN KEY \`FK_21e148b470ca04589cccfabedb6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_tax_details\` DROP FOREIGN KEY \`FK_c192de1316495232e0304238001\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tax_rules\` DROP FOREIGN KEY \`FK_47ae5fd4fe9f25707b6a01578a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`daily_sales_summaries\` DROP FOREIGN KEY \`FK_238871443b024bc173ea32fa315\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`login_audits\` DROP FOREIGN KEY \`FK_f76965bf9858a2cab885e064304\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` DROP FOREIGN KEY \`FK_2973b0643a982e66849450a7eb5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` DROP FOREIGN KEY \`FK_0d9934870049bb1fb92811e9d6a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_returns\` DROP FOREIGN KEY \`FK_84d91a4092b6fc040bd94f338a3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_return_details\` DROP FOREIGN KEY \`FK_9c97f5e21785db7ea46ccd615c8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sales_return_details\` DROP FOREIGN KEY \`FK_87d45e646f344a8bbe4485c0737\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_details\` DROP FOREIGN KEY \`FK_87c99e1de7cfc802d0865f57a36\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_details\` DROP FOREIGN KEY \`FK_d7fef51a6c57924613bdb3980cd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` DROP FOREIGN KEY \`FK_e1a6584a8c6c8244688b616ee34\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` DROP FOREIGN KEY \`FK_147da520d8b91d7464681b58904\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` DROP FOREIGN KEY \`FK_79092f35b92737898071717fd01\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_headers\` DROP FOREIGN KEY \`FK_37c9d7961f0a032d5a40092d72c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_taxes\` DROP FOREIGN KEY \`FK_2d4e5dc3fdb84e7ca7e6cdb8c4c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sale_taxes\` DROP FOREIGN KEY \`FK_0903dd3224128af6a04c9b1c400\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`taxes\` DROP FOREIGN KEY \`FK_3b850d0c8c3b744f80f3959a2fe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_e15427928c7a02bd304d628c41e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotions\` DROP FOREIGN KEY \`FK_d8ab737281d72169a5222615455\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion_rules\` DROP FOREIGN KEY \`FK_1fa4f95c1c6e798139222e89ee0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion_rules\` DROP FOREIGN KEY \`FK_601560bbf10d70de1395cb5a5fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_lists\` DROP FOREIGN KEY \`FK_31b210a096ef49b460258ecb701\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_lists\` DROP FOREIGN KEY \`FK_02d8838ac5cd6133a7fff466f43\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_list_items\` DROP FOREIGN KEY \`FK_62e2bd922d11fc8204172d6789c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`price_list_items\` DROP FOREIGN KEY \`FK_97f080960141255e54eecb9bdbd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_7862b9a401e0fe7dc5ef96e9116\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_f810ae885d5cb2d5748a407a148\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pos_devices\` DROP FOREIGN KEY \`FK_c20f0ec191fc266aceb2225cab1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_batches\` DROP FOREIGN KEY \`FK_d122a85da1b918954ddff35de77\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_batches\` DROP FOREIGN KEY \`FK_6a01847e73ea757f8205f67ecff\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_movements\` DROP FOREIGN KEY \`FK_279b7a659bd9dc152bfe5922009\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_movements\` DROP FOREIGN KEY \`FK_d76f5767ea35d4c281d2bcac34f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_counts\` DROP FOREIGN KEY \`FK_15c8c9a8dcb3d061639011203d9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_count_details\` DROP FOREIGN KEY \`FK_a2e1b4b8b5cadd91c2d712d7f7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventory_count_details\` DROP FOREIGN KEY \`FK_dfc3ac9f61c99db956884a31546\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_2014685d316d58cb0051a2a3374\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`inventories\` DROP FOREIGN KEY \`FK_13d90d420ac9dff1231d1ca0100\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_variants\` DROP FOREIGN KEY \`FK_f515690c571a03400a9876600b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_981bd4588a5ac92d66345a96837\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_6a5293e75c1c43abb90ce75a4c1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_37c1a605468d156e6a8f78f1dc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_67404fa0af91edbb4518a117f06\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_movements\` DROP FOREIGN KEY \`FK_81294ecc660543c080efcd33265\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` DROP FOREIGN KEY \`FK_bbd26e96daf91c4976137b2aea7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` DROP FOREIGN KEY \`FK_c60a038efb3df6f3e07504fdcd1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_sessions\` DROP FOREIGN KEY \`FK_00306b0b5451070efec0280b494\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`audit_logs\` DROP FOREIGN KEY \`FK_cfa83f61e4d27a87fcae1e025ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_400028436681d655ad3cd563540\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_lines\` DROP FOREIGN KEY \`FK_d9eecc536593997a18359db2b47\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_lines\` DROP FOREIGN KEY \`FK_3c913ef1f691ce5b2c490116309\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`journal_entries\` DROP FOREIGN KEY \`FK_8ddb19c8d608eda820581b1df72\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`branches\` DROP FOREIGN KEY \`FK_136a89f2131f33ae7346ef0b24a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Application_User\` DROP FOREIGN KEY \`FK_acf53534abef10f7268e0b4c7d9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Application_User\` DROP FOREIGN KEY \`FK_7c8ed69e240512f03e8e0580c29\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_09c1dd527bbdf3772ce595d30f0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_82ace3bcdfdead828dd5e10de50\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_8a4678008246639de8d95a313fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_3e14ecc38e15ecf503d1b3ead37\``,
    );
    await queryRunner.query(`DROP TABLE \`sale_tax_details\``);
    await queryRunner.query(`DROP TABLE \`tax_rules\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e10c2197782c82d966cf2f4749\` ON \`daily_sales_summaries\``,
    );
    await queryRunner.query(`DROP TABLE \`daily_sales_summaries\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4669e450251cf242492019453d\` ON \`login_audits\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3feac0530e3165c7dab1556bfb\` ON \`login_audits\``,
    );
    await queryRunner.query(`DROP TABLE \`login_audits\``);
    await queryRunner.query(`DROP TABLE \`sales_returns\``);
    await queryRunner.query(`DROP TABLE \`sales_return_details\``);
    await queryRunner.query(`DROP TABLE \`sale_details\``);
    await queryRunner.query(`DROP TABLE \`sale_headers\``);
    await queryRunner.query(`DROP TABLE \`sale_taxes\``);
    await queryRunner.query(`DROP TABLE \`taxes\``);
    await queryRunner.query(`DROP TABLE \`payments\``);
    await queryRunner.query(`DROP TABLE \`promotions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a9258b189219dc7fe9ab8faf34\` ON \`promotion_rules\``,
    );
    await queryRunner.query(`DROP TABLE \`promotion_rules\``);
    await queryRunner.query(`DROP TABLE \`price_lists\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4062555582e2235d62029e0b83\` ON \`price_list_items\``,
    );
    await queryRunner.query(`DROP TABLE \`price_list_items\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_163f54d15524000ed096c2f9a1\` ON \`shifts\``,
    );
    await queryRunner.query(`DROP TABLE \`shifts\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d05b4d04cf6279f9ea50e8cb12\` ON \`pos_devices\``,
    );
    await queryRunner.query(`DROP TABLE \`pos_devices\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_6604d6568a676d40af02c34464\` ON \`stock_batches\``,
    );
    await queryRunner.query(`DROP TABLE \`stock_batches\``);
    await queryRunner.query(`DROP TABLE \`inventory_movements\``);
    await queryRunner.query(`DROP TABLE \`inventory_counts\``);
    await queryRunner.query(`DROP TABLE \`inventory_count_details\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9bb0ac4d4e3c9dc0243e5633c1\` ON \`inventories\``,
    );
    await queryRunner.query(`DROP TABLE \`inventories\``);
    await queryRunner.query(`DROP TABLE \`product_variants\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4fdb91873f715304302b6d914e\` ON \`products\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_0974f4d322dd49c7e5c505e0b1\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`cash_movements\``);
    await queryRunner.query(`DROP TABLE \`cash_sessions\``);
    await queryRunner.query(`DROP TABLE \`audit_logs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_727413b70cc2beb4c1429e8193\` ON \`accounts\``,
    );
    await queryRunner.query(`DROP TABLE \`accounts\``);
    await queryRunner.query(`DROP TABLE \`journal_lines\``);
    await queryRunner.query(`DROP TABLE \`journal_entries\``);
    await queryRunner.query(`DROP TABLE \`tenants\``);
    await queryRunner.query(`DROP TABLE \`branches\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d27a5281b0208581289efda69f\` ON \`Application_User\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_de098fa25154ac41cefe250e39\` ON \`Application_User\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0446ae249022783bc1f9066a7d\` ON \`Application_User\``,
    );
    await queryRunner.query(`DROP TABLE \`Application_User\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7cb66c0b954e4b05d3e2d8ced0\` ON \`user_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_189df745b53983163422ea6c2d\` ON \`Application_role\``,
    );
    await queryRunner.query(`DROP TABLE \`Application_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b981c4b69a22595b998831c22\` ON \`role_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`role_permissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_661a09c0345da070d30e3ccee5\` ON \`permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
