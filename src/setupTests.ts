jest.mock("./utils/loadJson/loadJson", () => ({
  loadJson: () => ({}),
}));

jest.mock("./openapi/index", () => ({}));
