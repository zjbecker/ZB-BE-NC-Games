const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");

beforeAll(() => seed(testData));

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api/categories", () => {
    it("200: responds with an array of category objects", () => {
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
  describe("GET /api/reviews", () => {
    it("200: responds with an array of review objects. Sorted by date created (descending)", () => {
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
  describe("GET /api/reviews/:review_id", () => {
    it("200: responds with review object of the requested review_id", () => {
      return request(app)
        .get("/api/reviews/5")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
          });
          expect(review.review_id).toBe(5);
        });
    });
    it("400: responds with bad request when non valid id requested ", () => {
      return request(app)
        .get("/api/reviews/NotAnIdToday")
        .expect(400)
        .then(({ body: error }) => {
          expect(error).toMatchObject({ msg: expect.any(String) });
        });
    });
    it("404: responds with not found when requested a valid but non-existent review_id", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body: error }) => {
          expect(error).toMatchObject({ msg: expect.any(String) });
        });
    });
  });
  describe("Server Errors", () => {
    it("404: responds with a message when incorrect path entered", () => {
      return request(app)
        .get("/api/NOTcategories")
        .expect(404)
        .then(({ body: error }) => {
          expect(error).toMatchObject({ msg: expect.any(String) });
        });
    });
  });
});
