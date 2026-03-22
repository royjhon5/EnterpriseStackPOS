import { AccountingController } from '../Controllers/Accounting/AccountingController';
import { AuthController } from '../Controllers/Authentication/AuthController';
import { BranchController } from '../Controllers/Branch/BranchController';
import { CashManagementController } from '../Controllers/CashManagement/CashManagementController';
import { CategoryController } from '../Controllers/Category/CategoryController';
import { CustomerController } from '../Controllers/Customer/CustomerController';
import { InventoryCountController } from '../Controllers/InventoryCount/InventoryCountController';
import { InventoryController } from '../Controllers/Inventory/InventoryController';
import { InventoryMovementController } from '../Controllers/InventoryMovement/InventoryMovementController';
import { PermissionController } from '../Controllers/Permission/PermissionController';
import { ProductController } from '../Controllers/Product/ProductController';
import { PaymentsController } from '../Controllers/Payments/PaymentsController';
import { POSController } from '../Controllers/POS/POSController';
import { PricingController } from '../Controllers/Pricing/PricingController';
import { RoleController } from '../Controllers/Role/RoleController';
import { SalesController } from '../Controllers/Sales/SalesController';
import { DailySalesSummaryController } from '../Controllers/Summary/DailySalesSummaryController';
import { SalesReturnController } from '../Controllers/SalesReturn/SalesReturnController';
import { TaxController } from '../Controllers/Tax/TaxController';
import { TenantController } from '../Controllers/Tenant/TenantController';
import { UsersController } from '../Controllers/User/UserController';

export const ControllerContainer = [
  TenantController,
  AccountingController,
  BranchController,
  CashManagementController,
  CategoryController,
  CustomerController,
  InventoryController,
  InventoryCountController,
  InventoryMovementController,
  ProductController,
  SalesController,
  DailySalesSummaryController,
  PaymentsController,
  POSController,
  PricingController,
  SalesReturnController,
  TaxController,
  AuthController,
  UsersController,
  RoleController,
  PermissionController,
];
