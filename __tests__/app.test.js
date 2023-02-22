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
            expect(reviews).toBeSortedBy("created_at", { descending: true });
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
          expect(review.owner).toBe("mallionaire");
          expect(review.designer).toBe("Seymour Buttz");
          expect(review.review_id).toBe(5);
        });
    });
    it("400: responds with bad request when non valid id requested ", () => {
      return request(app)
        .get("/api/reviews/not-a-valid-id")
        .expect(400)
        .then(({ body: error }) => {
          expect(error.msg).toBe(
            'invalid input syntax for type integer: "not-a-valid-id"'
          );
        });
    });
    it("404: responds with not found when requested a valid but non-existent review_id", () => {
      return request(app)
        .get("/api/reviews/999")
        .expect(404)
        .then(({ body: error }) => {
          expect(error.msg).toBe("id not found");
        });
    });
  });

  describe("GET /api/reviews/:review_id/comments", () => {
    it("200: responds with array of comments for the given review_id sorted: desc", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              review_id: expect.any(Number),
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("200: responds with empty array when queried with valid review_id that has no comments in db", () => {
      return request(app)
        .get("/api/reviews/6/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    it("400: responds with bad request when non valid id requested ", () => {
      return request(app)
        .get("/api/reviews/not-a-valid-id-2/comments")
        .expect(400)
        .then(({ body: error }) => {
          expect(error.msg).toBe(
            'invalid input syntax for type integer: "not-a-valid-id-2"'
          );
        });
    });
    it("404: responds with msg when sent a query with a valid but non-existent review_id", () => {
      return request(app)
        .get("/api/reviews/99/comments")
        .expect(404)
        .then(({ body: error }) => {
          expect(error.msg).toBe("id not found");
        });
    });
  });

  describe("Server Errors", () => {
    it("404: responds with a message when incorrect path entered", () => {
      return request(app)
        .get("/api/NOTcategories")
        .expect(404)
        .then(({ body: error }) => {
          expect(error).toMatchObject({ msg: "invalid path" });
        });
    });
  });
  describe.only("PATCH /api/reviews/:review_id", () => {
    it("200: responds with updated review", () => {
      const patchToSend = { inc_votes: 100 };
      return request(app)
        .patch("/api/reviews/5")
        .send(patchToSend)
        .expect(200)
        .then(({ body: reviewUpdated }) => {
          console.log(reviewUpdated, "<<<test file");
        });
    });
  });
});
