import authPaths from "./auth.swagger.js";
import venuePaths from "./venue.swagger.js";
import organizerPaths from "./organizer.swagger.js";
import eventPaths from "./event.swagger.js";

const paths = {
  ...authPaths,
  ...venuePaths,
  ...organizerPaths,
  ...eventPaths,
};

export default paths;