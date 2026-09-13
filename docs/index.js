import authPaths from "./auth.swagger.js";
import venuePaths from "./venue.swagger.js";
import organizerPaths from "./organizer.swagger.js";
import eventPaths from "./event.swagger.js";
import regDataTypePaths from "./regDataType.swagger.js";
import groupCategoryPaths from "./groupCategory.swagger.js";
import categoryPaths from "./category.swagger.js";

const paths = {
  ...authPaths,
  ...venuePaths,
  ...organizerPaths,
  ...eventPaths,
  ...regDataTypePaths,
  ...groupCategoryPaths,
  ...categoryPaths,
};

export default paths;