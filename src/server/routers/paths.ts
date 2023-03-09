export const partialPaths = {
  users: {
    base: "/users",
    register: "/register",
    login: "/login",
    activate: "/activate",
    verifyToken: "/verify-token",
    logout: "/logout",
  },
};

export const paths = {
  root: "/",
  users: {
    register: `${partialPaths.users.base}${partialPaths.users.register}`,
    login: `${partialPaths.users.base}${partialPaths.users.login}`,
    activate: `${partialPaths.users.base}${partialPaths.users.activate}`,
    verifyToken: `${partialPaths.users.base}${partialPaths.users.verifyToken}`,
    logout: `${partialPaths.users.base}${partialPaths.users.logout}`,
  },
  apiDocs: {
    base: "/api-docs",
  },
};
