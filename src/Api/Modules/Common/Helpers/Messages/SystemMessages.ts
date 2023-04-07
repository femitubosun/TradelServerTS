export const PROVIDER_NOT_FOUND = "Provider Was Not Found";
export const MIDDLEWARE_ATTACHED = "Middleware Attached Successfully";
export const NOT_ALLOWED_BY_CORS = "This Origin is not allowed by CORS";
export const SERVER_STARTED = `Server Started`;
export const POSTGRES_DATABASE_CONNECTED =
  "Postgres Database Connected Successfully";
export const POSTGRES_DATABASE_CONNECTION_ERROR =
  "Postgres Database Connection Failure";
export const MONGODB_CONNECTED = "MongoDb Connected Successfully";
export const MONGODB_CONNECTION_ERROR = "MongoDB Connection Error";
export const EXPRESS_BOOTSTRAPPED = "Express Bootstrapped Successfully";
export const EXPRESS_BOOTSTRAPPED_ERROR = "Express Bootstrap Failure";
export const ROUTES_ATTACHED = "Routes Attached Successfully";

export const DATABASE_POPULATED = "Database Populated Successfully";
export const EMAIL_IN_USE = "Email is Already in Use";

export const ROLE_DOES_NOT_EXIST = "Role with this name does not exist";
export const DATABASE_ERROR = "Database Error";
export const SIGN_IN_SUCCESSFUL = "Sign in Successful";
export const SIGN_UP_SUCCESSFUL = "Sign up Successful";
export const CHECK_EMAIL_AND_PASSWORD = "Check Your Email and Password";

export const CUSTOMER_ONBOARDING_SUCCESS = "Customer Onboarded Successfully";
export const MERCHANT_ONBOARDING_SUCCESS = "Merchant Onboarded Successfully";
export const EMAIL_VERIFICATION_SUCCESS = "Email Verification Success";
export const INVALID_TOKEN = "Invalid Token";
export const TOKEN_EXPIRED =
  "This Token has Expired. Please Request a Fresh One.";
export const NO_TOKEN_RECORD = "No Token Record in Database";
export const INVALID_TOKEN_TYPE = "Invalid Token Type";

export const UNAUTHORIZED_OPERATION =
  "You are not authorized to perform this Operation";
export const EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS =
  "Email Verification Request Success";

export const USER_DOES_NOT_EXIST = "User does not exist";
export const EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT =
  "Bexxle's Tradel Email Activation";

/* ----------------------------- Resource Labels ---------------------------- */

export const PRODUCT_RESOURCE = "Product Resource";
export const PRODUCT_CATEGORY_RESOURCE = "Product Category Resource";
export const MERCHANT_RESOURCE = "Merchant Resource";
export const CUSTOMER_RESOURCE = "Customer Resource";
export const USER_RESOURCE = "User Resource";
export const WALLET_RESOURCE = "Wallet Resource";
export const CART_ITEM_RESOURCE = "Cart Item Resource";
export const MERCHANT_COLLECTION_RESOURCE = "Collection Resource";
export const PRODUCT_VARIANT_RESOURCE = "Product Variant Resource";
export const PRODUCT_VARIANT_OPTION_RESOURCE =
  "Product Variant Option Resource";
export const PURCHASE_ORDER_RESOURCE = "Purchase Order Resource";
export const SALES_ORDER_RESOURCE = "Sales Order Resource";

/* ------------------------------ Generic Messages  ------------------------- */

export const WELCOME_TO_API = "Welcome to Tradel Server API";
export const SOMETHING_WENT_WRONG =
  "Something went wrong while performing this operation";
export const INFORMATION_CREATED = "Information Created Successfully";
export const INFORMATION_RETRIEVED = "Information Retrieved Successfully";
export const INFORMATION_UPDATED = "Information Updated Successfully";
export const INVALID_CREDENTIALS = "Invalid Credentials";

/* ------------------------------  Response Statuses  ------------------------- */

export const SUCCESS = "success";
export const ERROR = "error";

/* --------------------------------- Role Labels ---------------------------- */
export const MERCHANT_ROLE_NAME = "merchant";
export const CUSTOMER_ROLE_NAME = "customer";

/* -----------------------------------  Errors  ------------------------------*/
export const INTERNAL_SERVER_ERROR = "Internal Server Error";
export const VALIDATION_ERROR = "Validation Error";
export const CRITICAL_ERROR_EXITING =
  "Application Encountered a Critical Error. Exiting";
export const ENV_NOT_FOUND_ERROR = ".env File is missing";

/* --------------------------  Authentication Messages  ---------------------*/
export const PASSWORD_RESET_TOKEN_EMAIL_SUBJECT =
  "Bexxle's Tradel Password Reset";
export const PASSWORD_RESET_LINK_GENERATED =
  "Password Recovery Link Generated. Please Check your mail";
export const PASSWORD_RESET_SUCCESSFULLY = "Password Changed Successfully";

/* ----------------------------------- Object States  ------------------------------*/
export const NULL_OBJECT = null;
export const NOT_APPLICABLE = "N/A";

/* -------------------------------  Cart Messages  --------------------------- */
export const CART_ITEM_REMOVED_SUCCESS = "Cart Item removed Successfully";

/*-------------------------------<  Variant Option  >--------------------------- */
export const INVALID_VARIANT_OPTIONS_PARENT = "Invalid Variant Options Parents";

/*----------------------------<  Collection Messages  >------------------------- */
export const COLLECTION_WITH_LABEL_ALREADY_EXISTS =
  "Collection With Label already exists";

/*-------------------------------<  Order Messages  >--------------------------- */
export const INSUFFICIENT_FUNDS_IN_WALLET = "Insufficient Funds in Wallet";
export const NOT_ENOUGH_STOCK = "Not Enough Stock";
export const CREATE_ORDER_FROM_CART_OPERATION = "Create Order From Cart ";
export const PAY_FOR_ORDER_OPERATION = "Payment for Order ";

export const YOU_HAVE_ALREADY_PAID_FOR_ORDER =
  "You have already paid for this order";
export const PLEASE_ACTIVATE_ACCOUNT_TO_COMPLETE_ORDER =
  "Please Activate Your account to complete your order";
