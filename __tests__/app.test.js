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
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET: 200: /api/reviews", () => {
    it("should return a 200 status and an array of review objects. Sorted by date created (descending)", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            });
            expect(reviews).toBeSortedBy("created_at", {
              descending: true,
            });
          });
        });
    });
  });
});

//area for my generic errors
describe("404: /api/incorrect-path", () => {
  it("should return 404 status and message when incorrect path entered", () => {
    return request(app)
      .get("/api/NOTcategories")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("incorrect path: please try again");
      });
  });
});
