process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const dbConnection = require("../db/dbConnection");

beforeEach(() => {
  return dbConnection.seed.run();
});
afterAll(() => {
  return dbConnection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET request", () => {
      test("returns status 200 and the topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics[0]).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET request", () => {
      test("returns status 200 and the required user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              user: [
                {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
              ],
            });
          });
      });
      // describe('ERROR handling', () => {
      //   test('404 - if requested user doesn\'t exist', () => {
      //     return request(app)
      //       .get('/api/users/vitalie')
      //       .expect(404)
      //   })
      // })
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      test("200 - responds with the required article by it's id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article: [
                {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 100,
                  comment_count: "13",
                },
              ],
            });
          });
      });
      //describe('ERRORS')
    });
    describe("PATCH", () => {
      test("200 - patch request has been accepted by the necessary votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article: [
                {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 99,
                },
              ],
            });
          });
      });
      //describe(ERRORS)
    });
    describe("/articles/...", () => {
      describe("POST", () => {
        test("201 - created a new comment on designated article", () => {
          return request(app)
            .post("/api/articles/11/comments")
            .expect(201)
            .send({
              username: "rogersop",
              body: "Yes, although you look more like a donkey",
            })
            .then(({ body }) => {
              // const date = () => {
              //   const dateNow = Date.now();
              //   const convertDate = new Date(dateNow);
              //   return convertDate.toISOString()
              // }
              expect(body).toEqual({
                comment: [
                  {
                    comment_id: 19,
                    author: "rogersop",
                    article_id: 11,
                    votes: 0,
                    created_at: "2021-03-10T16:36:19.310Z",
                    body: "Yes, although you look more like a donkey",
                  },
                ],
              });
            });
        });
      });
      
    });
  });
});
