import reducer from "./application";

describe("Reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(/not a function/i);
  });
});
