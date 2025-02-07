// ** Graphql
import pkg from "graphql";
const { GraphQLSchema, GraphQLObjectType } = pkg;

// ** Queries
import getAdmins from "./queries/getAdmins.js";
import getRolesPrivileges from "./queries/getRolesPrivileges.js";
import getSiteSettings from "./queries/getSiteSettings.js";
import getCoupons from "./queries/getCoupons.js";
import getStaticPages from "./queries/getStaticPages.js";
import getHomepage from "./queries/getHomepage.js";
import getShipping from "./queries/getShipping.js";
import getProductSettings from "./queries/getProductSettings.js";
import getCount from "./queries/getCount.js";
import {
  getCustomer,
  getCustomers,
  getWishlistProducts,
  getNewCustomers,
  getSuspendedCustomers,
} from "./queries/getCustomers.js";
import getCart from "./queries/getCart.js";
import {
  getProducts,
  getNewProducts,
  getOutOfStockProducts,
} from "./queries/getProducts.js";
import {
  getOrders,
  getRevenue,
  getSoldProducts,
  getPrevMonthOrders,
  getLastQuarterRevenue,
} from "./queries/getOrders.js";
import getSearchResults from "./queries/getSearchResults.js";

// ** Mutations
import { adminLogin, admins, deleteAdmin } from "./mutations/admins.js";
import { rolesPrivileges, deleteRole } from "./mutations/rolesPrivileges.js";
import siteSettings from "./mutations/siteSettings.js";
import { coupons, deleteCoupon, checkCoupon } from "./mutations/coupons.js";
import {
  changeCustomerPassword,
  changeAdminPassword,
} from "./mutations/changePassword.js";
import { staticPages, deleteStaticPage } from "./mutations/staticPages.js";
import homepage from "./mutations/homepage.js";
import shipping from "./mutations/shipping.js";
import {
  productSettings,
  productVariants,
  deleteProductVariant,
} from "./mutations/productSettings.js";
import {
  products,
  getProductById,
  getProductByName,
  getProductsByCategory,
  setTrendingProduct,
  deleteProduct,
} from "./mutations/products.js";
import authRegister from "./mutations/authRegister.js";
import authLogin from "./mutations/authLogin.js";
import logout from "./mutations/logout.js";
import {
  customers,
  getCustomerById,
  addToWishlist,
} from "./mutations/customers.js";
import {
  addToCart,
  deleteFromCart,
  changeCartQuantity,
} from "./mutations/cart.js";
import {
  createOrder,
  editOrder,
  getOrdersByCustomerId,
  getOrderById,
} from "./mutations/orders.js";
import sendVerificationCode from "./mutations/verificationCode.js";
import resetPassword from "./mutations/resetPassword.js";
import customerEnquiry from "./mutations/customerEnquiry.js";
import newsletter from "./mutations/newsletter.js";
import addProductReview from "./mutations/reviews.js";

const query = new GraphQLObjectType({
  name: "Queries",
  fields: () => ({
    getAdmins,
    getRolesPrivileges,
    getSiteSettings,
    getCoupons,
    getStaticPages,
    getHomepage,
    getShipping,
    getProducts,
    getNewProducts,
    getOutOfStockProducts,
    getProductSettings,
    getCount,
    getCustomer,
    getCustomers,
    getWishlistProducts,
    getNewCustomers,
    getSuspendedCustomers,
    getCart,
    getOrders,
    getRevenue,
    getSoldProducts,
    getPrevMonthOrders,
    getLastQuarterRevenue,
    getSearchResults,
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    adminLogin,
    admins,
    deleteAdmin,
    rolesPrivileges,
    deleteRole,
    changeCustomerPassword,
    changeAdminPassword,
    siteSettings,
    coupons,
    deleteCoupon,
    checkCoupon,
    staticPages,
    deleteStaticPage,
    homepage,
    shipping,
    productSettings,
    productVariants,
    deleteProductVariant,
    products,
    getProductById,
    getProductByName,
    getProductsByCategory,
    setTrendingProduct,
    deleteProduct,
    checkCoupon,
    authRegister,
    authLogin,
    customers,
    getCustomerById,
    addToWishlist,
    changeCustomerPassword,
    addToCart,
    deleteFromCart,
    changeCartQuantity,
    createOrder,
    editOrder,
    getOrdersByCustomerId,
    getOrderById,
    sendVerificationCode,
    resetPassword,
    customerEnquiry,
    newsletter,
    addProductReview,
    logout,
  }),
});

const schema = new GraphQLSchema({
  query: query,
  mutation: mutation,
});

export default schema;
