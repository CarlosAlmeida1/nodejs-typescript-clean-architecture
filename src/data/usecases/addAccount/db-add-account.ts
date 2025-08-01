import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols";

export class DbAddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;
  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, {
        password: hashedPassword,
      })
    );
    return new Promise((resolve) => resolve(account));
  }
}
