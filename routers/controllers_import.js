// Admin controllers
import { addAdmin, getAdmin, deleteAdmin, updateAdmin } from "../controllers/admin.controller.js";

// Auth controllers
import {
  login, changePassword, checkLoginStatus, logout, forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

//img controllers
import { uploadImage, deleteImage } from "../controllers/image.controller.js";

//blogs controllers
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteBlog
} from "../controllers/blogs.controller.js";

//clients controllers
import {
  addClient,
  getAllClients,
  getClientById,
  editClient,
  deleteClient
} from "../controllers/clients.controller.js";

//review controllers
import {
  addReview,
  getAllReviews,
  editReview,
  deleteReview
} from "../controllers/review.controller.js";

import {
  addProject,
  getAllProjects,
  getProjectById,
  editProject,
  deleteProject,
} from "../controllers/project.controller.js";

import {
  addWork,
  getAllWorks,
  getWorkById,
  editWork,
  deleteWork
} from "../controllers/works.controller.js";

import {
  addBanner,
  getAllBanners,
  getBannerById,
  editBanner,
  deleteBanner
} from "../controllers/banner.controller.js";

import {
  addEnquiry,
  getAllEnquiries,
  getEnquiryById,
  editEnquiry,
  deleteEnquiry
} from "../controllers/enquiry.controller.js";

import { getDashboardStats } from "../controllers/dashbord.controller.js";
import {
  addSubscriber,
  getAllSubscribers,
  deleteSubscribers
} from "../controllers/newsletter.controller.js";

// Named exports
export {
  // Admin
  addAdmin,
  getAdmin,
  deleteAdmin,
  updateAdmin,

  // Auth
  login,
  changePassword,
  checkLoginStatus,
  logout,
  forgotPassword,
  resetPassword,

  //img
  uploadImage,
  deleteImage,

  //dash
  getDashboardStats,

  //newsletter
  addSubscriber,
  getAllSubscribers,
  deleteSubscribers,

  //blogs
  addBlog,
  getBlogs,
  editBlog,
  deleteBlog,

  //clients
  addClient,
  getAllClients,
  getClientById,
  editClient,
  deleteClient,

  //review
  addReview,
  getAllReviews,
  editReview,
  deleteReview,

  //project
  addProject,
  getAllProjects,
  getProjectById,
  editProject,
  deleteProject,

  //works
  addWork,
  getAllWorks,
  getWorkById,
  editWork,
  deleteWork,

  //banners
  addBanner,
  getAllBanners,
  getBannerById,
  editBanner,
  deleteBanner,

  //enquiry
  addEnquiry,
  getAllEnquiries,
  getEnquiryById,
  editEnquiry,
  deleteEnquiry,
};
