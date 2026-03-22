//this is a database context where you going to input all of your newly made entities then after that run migration to apply all changes to the database

import { Account } from '../../Domain/Entities/Accounting/Accounting';
import { JournalEntry } from '../../Domain/Entities/Accounting/Journal';
import { JournalLine } from '../../Domain/Entities/Accounting/JournalLine';
import { AuditLog } from '../../Domain/Entities/Audit/AuditLog';
import { Branch } from '../../Domain/Entities/Branch/Branch';
import { CashSession } from '../../Domain/Entities/CashManagement/CashManagement';
import { CashMovement } from '../../Domain/Entities/CashManagement/CashMovement';
import { Category } from '../../Domain/Entities/Category/Category';
import { Customer } from '../../Domain/Entities/Customer/Customer';
import { Inventory } from '../../Domain/Entities/Inventory/Inventory';
import { InventoryCount } from '../../Domain/Entities/Inventory/InventoryCount';
import { InventoryCountDetail } from '../../Domain/Entities/Inventory/InventoryCountDetail';
import { InventoryMovement } from '../../Domain/Entities/Inventory/InventoryMovement';
import { StockBatch } from '../../Domain/Entities/Inventory/StockBatch';
import { Permission } from '../../Domain/Entities/Permission/Permission';
import { POSDevice } from '../../Domain/Entities/POS/POSDevice';
import { Shift } from '../../Domain/Entities/POS/Shift';
import { PriceList } from '../../Domain/Entities/Pricing/PricingList';
import { PriceListItem } from '../../Domain/Entities/Pricing/PricingListItem';
import { Product } from '../../Domain/Entities/Product/Product';
import { ProductVariant } from '../../Domain/Entities/Product/ProductVariant';
import { Promotion } from '../../Domain/Entities/Promotion/Promotion';
import { PromotionRule } from '../../Domain/Entities/Promotion/PromotionRule';
import { Role } from '../../Domain/Entities/Role/Role';
import { RolePermission } from '../../Domain/Entities/Role/RolePermission';
import { UserRole } from '../../Domain/Entities/Role/UserRole';
import { SaleDetail } from '../../Domain/Entities/Sales/SaleDetail';
import { SaleHeader } from '../../Domain/Entities/Sales/SaleHeader';
import { SalesReturn } from '../../Domain/Entities/SalesReturn/SalesReturn';
import { SalesReturnDetail } from '../../Domain/Entities/SalesReturn/SalesReturnDetail';
import { LoginAudit } from '../../Domain/Entities/Security/LoginAudit';
import { DailySalesSummary } from '../../Domain/Entities/Summary/DailySales';
import { SaleTax } from '../../Domain/Entities/Tax/SaleTax';
import { SaleTaxDetail } from '../../Domain/Entities/Tax/SaleTaxDetail';
import { Tax } from '../../Domain/Entities/Tax/Tax';
import { TaxRule } from '../../Domain/Entities/Tax/TaxRule';
import { Tenant } from '../../Domain/Entities/Tenant/Tenant';
import { Payment } from '../../Domain/Entities/Transaction/Payment';
import { User } from '../../Domain/Entities/User/User';

export const DbContext = [
  User,
  Tenant,
  Branch,
  Role,
  UserRole,
  Permission,
  RolePermission,
  Category,
  Product,
  ProductVariant,
  Inventory,
  InventoryMovement,
  Customer,
  SaleHeader,
  SaleDetail,
  Payment,
  Tax,
  SaleTax,
  AuditLog,
  DailySalesSummary,
  CashSession,
  CashMovement,
  Account,
  JournalEntry,
  JournalLine,
  SalesReturn,
  SalesReturnDetail,
  TaxRule,
  SaleTaxDetail,
  PriceList,
  PriceListItem,
  Promotion,
  PromotionRule,
  StockBatch,
  InventoryCount,
  InventoryCountDetail,
  POSDevice,
  Shift,
  LoginAudit,
];
