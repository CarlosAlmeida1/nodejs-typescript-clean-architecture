import request from "supertest";
import app from "../config/app";

describe("CORS Middleware", () => {
  test("Should enable CORS", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });

    await request(app)
      .get("/test_cors")
      .expect("access-Control-allow-origin", "*")
      .expect((res) => {
        expect(res.headers["access-control-allow-methods"]).toBe("*");
        expect(res.headers["access-control-allow-headers"]).toBe("*");
      });
  });
});
