import authPaths from "./auth.swagger.js";
import venuePaths from "./venue.swagger.js";
import organizerPaths from "./organizer.swagger.js";
import eventPaths from "./event.swagger.js";
import regDataTypePaths from "./regDataType.swagger.js";

const paths = {
  ...authPaths,
  ...venuePaths,
  ...organizerPaths,
  ...eventPaths,
  ...regDataTypePaths,
};

export default paths;