import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: "valid_id",
        name: accountData.name,
        email: accountData.email,
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};
interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { encrypterStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw Encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should throw addAccount throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});
