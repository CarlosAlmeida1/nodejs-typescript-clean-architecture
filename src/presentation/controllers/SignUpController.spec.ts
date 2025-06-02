import { SignUpController } from "./SignUpController";
import { EmailValidator } from "../protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../error";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new ServerError();
    }
  }
  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator();
  const sut = new SignUpController(emailValidator);
  return {
    sut,
    emailValidatorStub: emailValidator,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const { sut } = makeSut();
    const httRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation is provided", () => {
    const { sut } = makeSut();
    const httRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httRequest = {
      body: {
        email: "invalid_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should return 500 if email validator throws", () => {
    const emailValidator = makeEmailValidatorWithError();
    const sut = new SignUpController(emailValidator);
    const httRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    sut.handle(httRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
