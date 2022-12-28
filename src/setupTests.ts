jest.mock("./utils/loadJson", () => ({
  loadJson: () => ({}),
}));

jest.mock("./openapi/index", () => ({}));
