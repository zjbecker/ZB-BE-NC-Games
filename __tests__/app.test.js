const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");

beforeAll(() => seed(testData));

afterAll(() => db.end());

describe("/api/categories", () => {
  describe("GET: 200: /api/categories", () => {
    it("should return a 200 status and an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);

          categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });

          expect(categories[0].slug).toBe("euro game");
          expect(categories[3].slug).toBe("children's games");
        });
    });
  });
});

//area for my generic errors
describe("404: /api/WrongPath", () => {
  it("should return 404 status and message when incorrect path entered", () => {
    return request(app)
      .get("/api/NOTcategories")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("incorrect path: please try again");
      });
  });
});
