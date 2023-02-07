import { generateToken } from "Utils/generateToken";

describe("Generate Token Test", function () {
  it("Should generate random string of length", () => {
    const output = generateToken(5);

    expect(output.length).toEqual(5);
  });
});
