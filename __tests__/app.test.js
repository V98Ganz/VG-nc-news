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
      describe("just articles", () => {
        test("200 - responds with an array of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBe(12);

              articles.forEach((article) => {
                expect(article).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String),
                });
              });
            });
        });
        describe("Accepts queries, defaults to date", () => {
          test("testing defaults", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("can sort_by valid columns and set order", () => {
            return request(app)
              .get("/api/articles?sort_by=title&order=asc")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12);
                expect(articles).toBeSortedBy("title", {
                  descending: false,
                });
              });
          });
          test("we can filter by author", () => {
            return request(app)
              .get("/api/articles?author=rogersop")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(3);
                const filteredByAuthor = articles.every((article) => {
                  return article.author === "rogersop";
                });
                expect(filteredByAuthor).toBe(true);
              });
          });
          test("we can filter by topic", () => {
            return request(app)
              .get("/api/articles?topic=mitch")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(11);
                const filteredByTopic = articles.every((article) => {
                  return article.topic === "mitch";
                });
                expect(filteredByTopic).toBe(true);
              });
          });
          test('can filter by both at the same time', () => {
            return request(app)
              .get('/api/articles?topic=cats&author=rogersop')
              .expect(200)
              .then(({body: {articles}}) => {
                console.log(articles);
                expect(articles.length).toBe(1)
                const filterByBoth = articles.every(article => {
                  return article.topic === 'cats' && article.author === 'rogersop'
                });
                expect(filterByBoth).toBe(true)
              })
          })
          //describe(QUERY ERRORS)
        });
      });
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
    describe("/articles/.../comments", () => {
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
      describe("GET", () => {
        test("200 - returns an array of comments for the given article_id", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              comments.forEach((comment) => {
                expect(comment).toMatchObject({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                });
              });
              expect(comments.length).toBe(2);
            });
        });
        describe("Accepts queries", () => {
          test("sort_by and order sorts the comments by any valid column, asc or desc, defaults to created_at", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("sort_by and order - more examples - by votes", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("votes", {
                  descending: false,
                });
              });
          });
          test("if no order query is provided, it defaults to descending", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("author", {
                  descending: true,
                });
              });
          });
          //describe(ERRORS)
        });
      });
    });
  });
});
