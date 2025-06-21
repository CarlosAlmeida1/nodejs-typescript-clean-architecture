import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  hash: async (): Promise<string> => {
    return new Promise((resolve) => resolve("hash"));
  },
}));
const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("BcryptAdapter", () => {
  test("should call bcrypt.hash with correct values", async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  test("should throw if bcrypt.hash throws", async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error());
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
