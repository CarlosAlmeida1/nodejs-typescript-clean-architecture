import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "../error/missing-param-error";
import { Controller } from "../protocols/controller";
import { badRequest } from "../helpers/http-helper";

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
