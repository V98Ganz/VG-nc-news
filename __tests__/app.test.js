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
  describe("GET request", () => {
    test("200 - responds with a JSON describing all the available endpoints on the API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe("object");
        });
    });
  });
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
    describe("POST request", () => {
      test("201 - created a new topic", () => {
        return request(app)
          .post("/api/topics")
          .send({
            slug: "cabin building",
            description: "Let's build a cabin in the woods!!",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body).toEqual({
              topic: {
                slug: "cabin building",
                description: "Let's build a cabin in the woods!!",
              },
            });
          });
      });
    });
  });
  describe("/users", () => {
    test("GET request - all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    describe("GET request - with a username", () => {
      test("returns status 200 and the required user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              user: {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
            });
          });
      });
      describe("404 - user not found", () => {
        test("no user with that username", () => {
          return request(app)
            .get("/api/users/lois")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe(`User not found`);
            });
        });
      });
    });
    describe("POST request", () => {
      test("201 - created new user", () => {
        return request(app)
          .post("/api/users")
          .expect(201)
          .send({
            username: "tickle122",
            name: "Tom Tickle",
            avatar_url: "https://vignette.wikia.com",
          })
          .then(({ body }) => {
            expect(body).toEqual({
              user: {
                username: "tickle122",
                name: "Tom Tickle",
                avatar_url: "https://vignette.wikia.com",
              },
            });
          });
      });
    });
    describe("ERRORS", () => {
      test("405 - PUT method not allowed", () => {
        return request(app)
          .put("/api/users/butter_bridge")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Method not allowed");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      describe("just articles", () => {
        test("200 - responds with an array of article objects", () => {
          return request(app)
            .get("/api/articles?limit=12")
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
              .get("/api/articles?limit=12")
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
              .get("/api/articles?sort_by=title&order=asc&limit=12")
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
              .get("/api/articles?topic=mitch&limit=11")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(11);
                const filteredByTopic = articles.every((article) => {
                  return article.topic === "mitch";
                });
                expect(filteredByTopic).toBe(true);
              });
          });
          test("can filter by both at the same time", () => {
            return request(app)
              .get("/api/articles?topic=cats&author=rogersop")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).toBe(1);
                const filterByBoth = articles.every((article) => {
                  return (
                    article.topic === "cats" && article.author === "rogersop"
                  );
                });
                expect(filterByBoth).toBe(true);
              });
          });
          test("there is limit per page, default 10", () => {
            return request(app)
              .get("/api/articles?limit=9")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(9);
              });
          });
          test("testing limit default", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(10);
              });
          });
          test("the p query specifies the page", () => {
            return request(app)
              .get("/api/articles?p=2")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(2);
              });
          });
          test("checking page and limit in conjunction", () => {
            return request(app)
              .get("/api/articles?limit=4&p=3")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(4);
              });
          });
          test("adding the total_count property, displaying the total number of articles", () => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { total_count } }) => {
                expect(total_count).toBe(12);
              });
          });
          describe("ERRORS - QUERIES", () => {
            test("405 - invalid column", () => {
              return request(app)
                .get("/api/articles?sort_by=color")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("No such column");
                });
            });
            test("404 - no such topic", () => {
              return request(app)
                .get("/api/articles?topic=jokes")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("No such topic");
                });
            });
            test("404 - non-existent author", () => {
              return request(app)
                .get("/api/articles?author=vitalie")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User not found");
                });
            });
          });
        });
      });
      test("200 - responds with the required article by it's id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article: {
                article_id: 1,
                title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100,
                comment_count: "13",
              },
            });
          });
      });
      test("200 - more examples", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
      });
      describe("ERRORS", () => {
        test("405 - Method not found", () => {
          return request(app)
            .patch("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
        test("405 - more examples", () => {
          return request(app)
            .put("/api/articles/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
        test("404 - article id not found", () => {
          return request(app)
            .get("/api/articles/88")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Article not found");
            });
        });
        test("more errors examples", () => {
          return request(app)
            .get("/api/articles/dog")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid text representation");
            });
        });
      });
    });
    describe("PATCH", () => {
      test("201 - patch request has been accepted by the necessary votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(201)
          .then(({ body }) => {
            expect(body).toEqual({
              article: {
                article_id: 1,
                title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 99,
              },
            });
          });
      });
      test("200 - patch request contains no body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send()
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article: {
                article_id: 1,
                title: "Living in the shadow of a great man",
                author: "butter_bridge",
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2018-11-15T12:21:54.171Z",
                votes: 100,
              },
            });
          });
      });
    });
    describe("DELETE", () => {
      test("204 - article has been deleted according to it's id", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {
            return dbConnection.select("*").from("articles").where({
              article_id: 1,
            });
          })
          .then((article) => {
            expect(article).toHaveLength(0);
          });
      });
      test("204 - comments are also deleted in consequence", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {
            return dbConnection.select("*").from("comments").where({
              article_id: 1,
            });
          })
          .then((comments) => {
            expect(comments).toHaveLength(0);
          });
      });
      test("404 - article wasn't fount", () => {
        return request(app)
          .delete("/api/articles/71")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      describe("POST", () => {
        test("201 - created a new comment on designated article", () => {
          return request(app)
            .post("/api/articles/11/comments")
            .expect(201)
            .send({
              username: "rogersop",
              body: "Yes, although you look more like a donkey",
            })
            .then(({ body: { comment } }) => {
              expect(comment).toMatchObject({
                comment_id: 19,
                author: "rogersop",
                votes: 0,
                created_at: expect.any(String),
                body: "Yes, although you look more like a donkey",
              });
            });
        });
        describe("ERRORS - POST", () => {
          test("400 - bad request if required keys aren't input", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .expect(400)
              .send({
                body: "Hey mamma",
              })
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Please provide all the required keys");
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
          test("more examples", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc&limit=15")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(13);

                expect(comments).toBeSortedBy("created_at", {
                  descending: false,
                });
              });
          });
          test("limit - limits the number of responses, default 10", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=5")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(5);
              });
          });
          test("p - specifies the page at witch to start", () => {
            return request(app)
              .get("/api/articles/1/comments?p=2")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(3);
              });
          });
          describe("ERRORS - Queries", () => {
            test("405 - not a valid column", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=country")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("No such column");
                });
            });
          });
        });
        describe("ERRORS - GET", () => {
          test("404 - article doesn't exist", () => {
            return request(app)
              .get("/api/articles/1000/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found");
              });
          });
          test("405 - invalid article id", () => {
            return request(app)
              .get("/api/articles/uno/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid text representation");
              });
          });
        });
      });
      describe("Errors - GENERAL", () => {
        test("405 - PUT request not allowed", () => {
          return request(app)
            .put("/api/articles/1/comments")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
      });
    });
  });
  describe("/comments", () => {
    describe(".../:comments_id", () => {
      describe("PATCH", () => {
        test("votes can be incremented", () => {
          return request(app)
            .patch("/api/comments/4")
            .expect(200)
            .send({ inc_votes: 50 })
            .then(({ body: { comment } }) => {
              expect(comment).toEqual({
                comment_id: 4,
                author: "icellusedkars",
                votes: -50,
                created_at: "2014-11-23T12:36:03.389Z",
                body:
                  " I carry a log ??? yes. Is it funny to you? It is not to me.",
              });
            });
        });
        test("votes can be reduced", () => {
          return request(app)
            .patch("/api/comments/4")
            .expect(200)
            .send({ inc_votes: -50 })
            .then(({ body: { comment } }) => {
              expect(comment).toEqual({
                comment_id: 4,
                author: "icellusedkars",
                votes: -150,
                created_at: "2014-11-23T12:36:03.389Z",
                body:
                  " I carry a log ??? yes. Is it funny to you? It is not to me.",
              });
            });
        });
        test("unchanged body is returned if no votes are provided", () => {
          return request(app)
            .patch("/api/comments/4")
            .expect(200)
            .send({})
            .then(({ body: { comment } }) => {
              expect(comment).toEqual({
                comment_id: 4,
                author: "icellusedkars",
                votes: -100,
                created_at: "2014-11-23T12:36:03.389Z",
                body:
                  " I carry a log ??? yes. Is it funny to you? It is not to me.",
              });
            });
        });
        describe("ERRORS - PATCH", () => {
          test("404 - comment_id doesn't exist", () => {
            return request(app)
              .patch("/api/comments/99")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Comment not found");
              });
          });
        });
      });
      describe("DELETE", () => {
        test("204 - comment has been deleted", () => {
          return request(app)
            .delete("/api/comments/4")
            .expect(204)
            .then(() => {
              return dbConnection.select("*").from("comments").where({
                comment_id: 4,
              });
            })
            .then((comment) => {
              expect(comment).toHaveLength(0);
            });
        });
        test("404 - comment_id not found", () => {
          return request(app)
            .delete("/api/comments/68")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Comment not found");
            });
        });
      });
      describe("ERRORS", () => {
        test("405 - PUT method not found", () => {
          return request(app)
            .put("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed");
            });
        });
      });
    });
  });
  describe("ERRORS - Root level", () => {
    test("405 - DELETE method not allowed", () => {
      return request(app).delete("/api").expect(405);
    });
  });
});
