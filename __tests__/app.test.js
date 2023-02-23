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
  describe("POST /api/reviews/:review_id/comments", () => {
    it("201: responds with the posted comment and should be correctly added to the db", () => {
      const commentToPost = {
        username: "philippaclaire9",
        body: "fabulous day for testing",
      };

      return request(app)
        .post("/api/reviews/3/comments")
        .send(commentToPost)
        .expect(201)
        .then(({ body: { postedComment } }) => {
          expect(postedComment).toMatchObject({
            comment_id: 7,
            review_id: 3,
            author: "philippaclaire9",
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
    it("201: responds with the posted comment and ignores added properties on sent object", () => {
      const commentToPost = {
        username: "philippaclaire9",
        body: "fabulous day for testing",
        another: "will not be needing this",
        1: 100,
      };

      return request(app)
        .post("/api/reviews/3/comments")
        .send(commentToPost)
        .expect(201)
        .then(({ body: { postedComment } }) => {
          expect(postedComment).toMatchObject({
            comment_id: 8,
            review_id: 3,
            author: "philippaclaire9",
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
    it("400: responds with bad request when queried with an invalid username", () => {
      const commentToPost = {
        username: undefined,
        body: "fabulous day for testing",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(commentToPost)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid username");
        });
    });
    it("400: responds with bad request when queried with an invalid comment", () => {
      const commentToPost = {
        username: "Username",
        3: "hi",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .send(commentToPost)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid comment");
        });
    });
    it("404: responds not found when valid but non existent username queried", () => {
      const commentToPost = {
        username: "NotAUser",
        body: "fabulous day for testing",
      };

      return request(app)
        .post("/api/reviews/3/comments")
        .send(commentToPost)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("user not found");
        });
    });
    it("400: responds with bad request when non valid review_id requested", () => {
      const commentToPost = {
        username: "philippaclaire9",
        body: "fabulous day for testing",
      };

      return request(app)
        .post("/api/reviews/not-a-valid-id/comments")
        .send(commentToPost)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'invalid input syntax for type integer: "not-a-valid-id"'
          );
        });
    });
    it("404: responds with msg when sent a query with a valid but non-existent review_id", () => {
      const commentToPost = {
        username: "philippaclaire9",
        body: "fabulous day for testing",
      };

      return request(app)
        .post("/api/reviews/999/comments")
        .send(commentToPost)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("id not found");
        });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    it("200: responds with updated review : votes increased", () => {
      const patchToSend = { inc_votes: 1000 };
      return request(app)
        .patch("/api/reviews/5")
        .send(patchToSend)
        .expect(200)
        .then(({ body: { updatedReview } }) => {
          expect(updatedReview).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            votes: 1005,
            designer: expect.any(String),
          });
        });
    });
    it("200: responds with updated review : votes decreased", () => {
      const patchToSend = { inc_votes: -3 };
      return request(app)
        .patch("/api/reviews/2")
        .send(patchToSend)
        .expect(200)
        .then(({ body: { updatedReview } }) => {
          expect(updatedReview).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            votes: 2,
            designer: expect.any(String),
          });
        });
    });
    it("200: responds with updated review ignores added properties on sent object", () => {
      const patchToSend = {
        inc_votes: 1,
        1: 100,
        another: "should not be used",
      };
      return request(app)
        .patch("/api/reviews/5")
        .send(patchToSend)
        .expect(200)
        .then(({ body: { updatedReview } }) => {
          expect(updatedReview).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_body: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            votes: 1006,
            designer: expect.any(String),
          });
        });
    });
    it("400: responds with bad request when non valid review_id requested", () => {
      const patchToSend = { inc_votes: 1000 };

      return request(app)
        .patch("/api/reviews/not-a-valid-id")
        .send(patchToSend)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'invalid input syntax for type integer: "not-a-valid-id"'
          );
        });
    });
    it("404: responds with msg when sent a query with a valid but non-existent review_id", () => {
      const patchToSend = { inc_votes: 1000 };

      return request(app)
        .patch("/api/reviews/999")
        .send(patchToSend)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("id not found");
        });
    });
    it("400: responds with msg when sent an invalid inc_votes property/key", () => {
      const patchToSend = { inc_votes: "not valid" };

      return request(app)
        .patch("/api/reviews/3")
        .send(patchToSend)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid vote patch");
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
});
