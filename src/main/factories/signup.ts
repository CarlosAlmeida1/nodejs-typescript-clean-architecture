import { DbAddAccount } from "../../data/usecases/addAccount/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controllers/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(12);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
