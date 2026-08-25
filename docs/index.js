import authPaths from "./auth.swagger.js";
import venuePaths from "./venue.swagger.js";
import organizerPaths from "./organizer.swagger.js";

const paths = {
  ...authPaths,
  ...venuePaths,
  ...organizerPaths,
};

export default paths;