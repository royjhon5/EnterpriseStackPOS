import { CreateAccountCommandHandler } from '../../Application/Command/Accounting/CreateAccountCommandHandler';
import { CreateJournalEntryCommandHandler } from '../../Application/Command/Accounting/CreateJournalEntryCommandHandler';
import { DeleteAccountCommandHandler } from '../../Application/Command/Accounting/DeleteAccountCommandHandler';
import { UpdateAccountCommandHandler } from '../../Application/Command/Accounting/UpdateAccountCommandHandler';
import { GetAccountByIdQueryHandler } from '../../Application/Queries/Accounting/GetAccountByIdQueryHandler';
import { GetAccountsQueryHandler } from '../../Application/Queries/Accounting/GetAccountsQueryHandler';
import { GetJournalEntriesQueryHandler } from '../../Application/Queries/Accounting/GetJournalEntriesQueryHandler';
import { GetJournalEntryByIdQueryHandler } from '../../Application/Queries/Accounting/GetJournalEntryByIdQueryHandler';
import { CreateBranchCommandHandler } from '../../Application/Command/Branch/CreateBranchCommandHandler';
import { CloseCashSessionCommandHandler } from '../../Application/Command/CashManagement/CloseCashSessionCommandHandler';
import { CreateCashMovementCommandHandler } from '../../Application/Command/CashManagement/CreateCashMovementCommandHandler';
import { OpenCashSessionCommandHandler } from '../../Application/Command/CashManagement/OpenCashSessionCommandHandler';
import { GetCashMovementByIdQueryHandler } from '../../Application/Queries/CashManagement/GetCashMovementByIdQueryHandler';
import { GetCashMovementsQueryHandler } from '../../Application/Queries/CashManagement/GetCashMovementsQueryHandler';
import { GetCashSessionByIdQueryHandler } from '../../Application/Queries/CashManagement/GetCashSessionByIdQueryHandler';
import { GetCashSessionsQueryHandler } from '../../Application/Queries/CashManagement/GetCashSessionsQueryHandler';
import { CreateCategoryCommandHandler } from '../../Application/Command/Category/CreateCategoryCommandHandler';
import { DeleteCategoryCommandHandler } from '../../Application/Command/Category/DeleteCategoryCommandHandler';
import { DeleteBranchCommandHandler } from '../../Application/Command/Branch/DeleteBranchCommandHandler';
import { UpdateCategoryCommandHandler } from '../../Application/Command/Category/UpdateCategoryCommandHandler';
import { UpdateBranchCommandHandler } from '../../Application/Command/Branch/UpdateBranchCommandHandler';
import { CreateCustomerCommandHandler } from '../../Application/Command/Customer/CreateCustomerCommandHandler';
import { DeleteCustomerCommandHandler } from '../../Application/Command/Customer/DeleteCustomerCommandHandler';
import { UpdateCustomerCommandHandler } from '../../Application/Command/Customer/UpdateCustomerCommandHandler';
import { CreateInventoryCommandHandler } from '../../Application/Command/Inventory/CreateInventoryCommandHandler';
import { DeleteInventoryCommandHandler } from '../../Application/Command/Inventory/DeleteInventoryCommandHandler';
import { CancelInventoryCountCommandHandler } from '../../Application/Command/InventoryCount/CancelInventoryCountCommandHandler';
import { CreateInventoryCountCommandHandler } from '../../Application/Command/InventoryCount/CreateInventoryCountCommandHandler';
import { PostInventoryCountCommandHandler } from '../../Application/Command/InventoryCount/PostInventoryCountCommandHandler';
import { GetInventoryCountByIdQueryHandler } from '../../Application/Queries/InventoryCount/GetInventoryCountByIdQueryHandler';
import { GetInventoryCountsQueryHandler } from '../../Application/Queries/InventoryCount/GetInventoryCountsQueryHandler';
import { UpdateInventoryCommandHandler } from '../../Application/Command/Inventory/UpdateInventoryCommandHandler';
import { CreateInventoryMovementCommandHandler } from '../../Application/Command/InventoryMovement/CreateInventoryMovementCommandHandler';
import { CreatePaymentCommandHandler } from '../../Application/Command/Payments/CreatePaymentCommandHandler';
import { CloseShiftCommandHandler } from '../../Application/Command/POS/CloseShiftCommandHandler';
import { CreatePOSDeviceCommandHandler } from '../../Application/Command/POS/CreatePOSDeviceCommandHandler';
import { DeletePOSDeviceCommandHandler } from '../../Application/Command/POS/DeletePOSDeviceCommandHandler';
import { OpenShiftCommandHandler } from '../../Application/Command/POS/OpenShiftCommandHandler';
import { UpdatePOSDeviceCommandHandler } from '../../Application/Command/POS/UpdatePOSDeviceCommandHandler';
import { GetPOSDeviceByIdQueryHandler } from '../../Application/Queries/POS/GetPOSDeviceByIdQueryHandler';
import { GetPOSDevicesQueryHandler } from '../../Application/Queries/POS/GetPOSDevicesQueryHandler';
import { GetShiftByIdQueryHandler } from '../../Application/Queries/POS/GetShiftByIdQueryHandler';
import { GetShiftsQueryHandler } from '../../Application/Queries/POS/GetShiftsQueryHandler';
import { CreatePermissionCommandHandler } from '../../Application/Command/Permission/CreatePermissionCommandHandler';
import { DeletePermissionCommandHandler } from '../../Application/Command/Permission/DeletePermissionCommandHandler';
import { CreateProductCommandHandler } from '../../Application/Command/Product/CreateProductCommandHandler';
import { CreatePriceListCommandHandler } from '../../Application/Command/Pricing/CreatePriceListCommandHandler';
import { DeletePriceListCommandHandler } from '../../Application/Command/Pricing/DeletePriceListCommandHandler';
import { UpdatePriceListCommandHandler } from '../../Application/Command/Pricing/UpdatePriceListCommandHandler';
import { GetPriceListByIdQueryHandler } from '../../Application/Queries/Pricing/GetPriceListByIdQueryHandler';
import { GetPriceListsQueryHandler } from '../../Application/Queries/Pricing/GetPriceListsQueryHandler';
import { DeleteProductCommandHandler } from '../../Application/Command/Product/DeleteProductCommandHandler';
import { UpdateProductCommandHandler } from '../../Application/Command/Product/UpdateProductCommandHandler';
import { CreateRoleCommandHandler } from '../../Application/Command/Role/CreateRoleCommandHandler';
import { DeleteRoleCommandHandler } from '../../Application/Command/Role/DeleteRoleCommandHandler';
import { RolePermissionCommandHandler } from '../../Application/Command/Role/RolePermissionCommandHandler';
import { UpdateRoleCommandHandler } from '../../Application/Command/Role/UpdateRoleCommandHandler';
import { CreateSaleCommandHandler } from '../../Application/Command/Sales/CreateSaleCommandHandler';
import { GenerateDailySalesSummariesCommandHandler } from '../../Application/Command/Summary/GenerateDailySalesSummariesCommandHandler';
import { VoidSaleCommandHandler } from '../../Application/Command/Sales/VoidSaleCommandHandler';
import { CreateSalesReturnCommandHandler } from '../../Application/Command/SalesReturn/CreateSalesReturnCommandHandler';
import { CreateTaxCommandHandler } from '../../Application/Command/Tax/CreateTaxCommandHandler';
import { DeleteTaxCommandHandler } from '../../Application/Command/Tax/DeleteTaxCommandHandler';
import { UpdateTaxCommandHandler } from '../../Application/Command/Tax/UpdateTaxCommandHandler';
import { GetTaxByIdQueryHandler } from '../../Application/Queries/Tax/GetTaxByIdQueryHandler';
import { GetTaxesQueryHandler } from '../../Application/Queries/Tax/GetTaxesQueryHandler';
import { CreateTenantCommandHandler } from '../../Application/Command/Tenant/CreateTenantCommandHandler';
import { SoftDeleteTenantCommandHandler } from '../../Application/Command/Tenant/DeleteTenantCommandHandler';
import { UpdateTenantCommandHandler } from '../../Application/Command/Tenant/UpdateTenantCommandHandler';
import { ActivateUserCommandHandler } from '../../Application/Command/User/ActivateUserCommandHandler';
import { CreateUserCommandHandler } from '../../Application/Command/User/CreateUserCommandHandler';
import { DeActivateUserCommandHandler } from '../../Application/Command/User/DeActivateUserCommandHandler';
import { DeleteUserCommandHandler } from '../../Application/Command/User/DeleteUserCommandHandler';
import { LoginUserHandler } from '../../Application/Command/User/LoginUserCommandHandler';
import { UpdateUserCommandHandler } from '../../Application/Command/User/UpdateUserCommandHandler';
import { UserService } from '../../Application/Command/User/UserService';
import { GetAllBranchesQueryHandler } from '../../Application/Queries/Branch/GetAllBranchQueryHandler';
import { GetBranchDetailByIdQueryHandler } from '../../Application/Queries/Branch/GetBranchDetailByIdQueryHandler';
import { GetCategoriesQueryHandler } from '../../Application/Queries/Category/GetCategoriesQueryHandler';
import { GetCategoryByIdQueryHandler } from '../../Application/Queries/Category/GetCategoryByIdQueryHandler';
import { GetCustomerByIdQueryHandler } from '../../Application/Queries/Customer/GetCustomerByIdQueryHandler';
import { GetCustomersQueryHandler } from '../../Application/Queries/Customer/GetCustomersQueryHandler';
import { GetInventoriesQueryHandler } from '../../Application/Queries/Inventory/GetInventoriesQueryHandler';
import { GetInventoryByIdQueryHandler } from '../../Application/Queries/Inventory/GetInventoryByIdQueryHandler';
import { GetInventoryMovementByIdQueryHandler } from '../../Application/Queries/InventoryMovement/GetInventoryMovementByIdQueryHandler';
import { GetInventoryMovementsQueryHandler } from '../../Application/Queries/InventoryMovement/GetInventoryMovementsQueryHandler';
import { GetPaymentByIdQueryHandler } from '../../Application/Queries/Payments/GetPaymentByIdQueryHandler';
import { GetPaymentsQueryHandler } from '../../Application/Queries/Payments/GetPaymentsQueryHandler';
import { GetAllPermissionsQueryHandler } from '../../Application/Queries/Permission/GetAllPermissionsQueryHandler';
import { GetPermissionByIdQueryHandler } from '../../Application/Queries/Permission/GetPermissionByIdQueryHandler';
import { GetRolePermissionsQueryHandler } from '../../Application/Queries/Permission/GetRolePermissionsQueryHandler';
import { GetProductByIdQueryHandler } from '../../Application/Queries/Product/GetProductByIdQueryHandler';
import { GetProductsQueryHandler } from '../../Application/Queries/Product/GetProductsQueryHandler';
import { GetSaleByIdQueryHandler } from '../../Application/Queries/Sales/GetSaleByIdQueryHandler';
import { GetSalesQueryHandler } from '../../Application/Queries/Sales/GetSalesQueryHandler';
import { GetSalesSummaryQueryHandler } from '../../Application/Queries/Sales/GetSalesSummaryQueryHandler';
import { GetDailySalesSummariesQueryHandler } from '../../Application/Queries/Summary/GetDailySalesSummariesQueryHandler';
import { GetDailySalesSummaryByIdQueryHandler } from '../../Application/Queries/Summary/GetDailySalesSummaryByIdQueryHandler';
import { GetSalesReturnByIdQueryHandler } from '../../Application/Queries/SalesReturn/GetSalesReturnByIdQueryHandler';
import { GetSalesReturnsQueryHandler } from '../../Application/Queries/SalesReturn/GetSalesReturnsQueryHandler';
import { GetAllTenantsQueryHandler } from '../../Application/Queries/Tenant/GetAllTenantsQueryHandler';
import { GetTenantByIdQueryHandler } from '../../Application/Queries/Tenant/GetTenantByIdQueryHandler';
import { GetUserDetailsQueryHandler } from '../../Application/Queries/User/GetUserDetailsQueryHandler';
import { GetUserQueryHandler } from '../../Application/Queries/User/GetUserQueryHandler';

export const HandlerProvider = [
  //tenant handlers
  CreateTenantCommandHandler,
  UpdateTenantCommandHandler,
  SoftDeleteTenantCommandHandler,
  GetAllTenantsQueryHandler,
  GetTenantByIdQueryHandler,

  CreateAccountCommandHandler,
  UpdateAccountCommandHandler,
  DeleteAccountCommandHandler,
  CreateJournalEntryCommandHandler,
  GetAccountsQueryHandler,
  GetAccountByIdQueryHandler,
  GetJournalEntriesQueryHandler,
  GetJournalEntryByIdQueryHandler,

  //branch handlers
  CreateBranchCommandHandler,
  UpdateBranchCommandHandler,
  DeleteBranchCommandHandler,
  GetAllBranchesQueryHandler,
  GetBranchDetailByIdQueryHandler,

  CloseCashSessionCommandHandler,
  OpenCashSessionCommandHandler,
  CreateCashMovementCommandHandler,
  GetCashSessionsQueryHandler,
  GetCashSessionByIdQueryHandler,
  GetCashMovementsQueryHandler,
  GetCashMovementByIdQueryHandler,

  //catalog handlers
  CreateCategoryCommandHandler,
  UpdateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  GetCategoriesQueryHandler,
  GetCategoryByIdQueryHandler,
  CreateProductCommandHandler,
  CreateCustomerCommandHandler,
  UpdateProductCommandHandler,
  UpdateCustomerCommandHandler,
  DeleteProductCommandHandler,
  DeleteCustomerCommandHandler,
  CreatePriceListCommandHandler,
  UpdatePriceListCommandHandler,
  DeletePriceListCommandHandler,
  GetProductsQueryHandler,
  GetCustomersQueryHandler,
  GetPriceListsQueryHandler,
  GetProductByIdQueryHandler,
  GetCustomerByIdQueryHandler,
  GetPriceListByIdQueryHandler,
  CreateInventoryCommandHandler,
  UpdateInventoryCommandHandler,
  DeleteInventoryCommandHandler,
  CreateInventoryCountCommandHandler,
  PostInventoryCountCommandHandler,
  CancelInventoryCountCommandHandler,
  GetInventoriesQueryHandler,
  GetInventoryByIdQueryHandler,
  GetInventoryCountsQueryHandler,
  GetInventoryCountByIdQueryHandler,
  CreateInventoryMovementCommandHandler,
  GetInventoryMovementsQueryHandler,
  GetInventoryMovementByIdQueryHandler,
  CreateSaleCommandHandler,
  GenerateDailySalesSummariesCommandHandler,
  VoidSaleCommandHandler,
  GetSalesQueryHandler,
  GetSalesSummaryQueryHandler,
  GetDailySalesSummariesQueryHandler,
  GetDailySalesSummaryByIdQueryHandler,
  GetSaleByIdQueryHandler,
  CreatePaymentCommandHandler,
  CreatePOSDeviceCommandHandler,
  UpdatePOSDeviceCommandHandler,
  DeletePOSDeviceCommandHandler,
  OpenShiftCommandHandler,
  CloseShiftCommandHandler,
  GetPaymentsQueryHandler,
  GetPOSDevicesQueryHandler,
  GetShiftByIdQueryHandler,
  GetShiftsQueryHandler,
  GetPaymentByIdQueryHandler,
  GetPOSDeviceByIdQueryHandler,
  CreateSalesReturnCommandHandler,
  GetSalesReturnsQueryHandler,
  GetSalesReturnByIdQueryHandler,
  CreateTaxCommandHandler,
  UpdateTaxCommandHandler,
  DeleteTaxCommandHandler,
  GetTaxesQueryHandler,
  GetTaxByIdQueryHandler,

  //Authentication
  LoginUserHandler,
  UserService,

  //User
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
  ActivateUserCommandHandler,
  DeActivateUserCommandHandler,
  GetUserQueryHandler,
  GetUserDetailsQueryHandler,

  //roles and permissions
  CreateRoleCommandHandler,
  UpdateRoleCommandHandler,
  DeleteRoleCommandHandler,
  RolePermissionCommandHandler,
  CreatePermissionCommandHandler,
  DeletePermissionCommandHandler,
  GetAllPermissionsQueryHandler,
  GetPermissionByIdQueryHandler,
  GetRolePermissionsQueryHandler,
];
