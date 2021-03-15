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
              user:
                {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
            });
          });
      });
    });
    describe('404 - user not found', () => {
      test('no user with that username', () => {
        return request(app)
          .get('/api/users/lois')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe(`User not found`)
          })
      })
    })
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
                expect(articles.length).toBe(1)
                const filterByBoth = articles.every(article => {
                  return article.topic === 'cats' && article.author === 'rogersop'
                });
                expect(filterByBoth).toBe(true)
              })
          })
          describe('ERRORS - QUERIES', () => {
            test('405 - invalid column', () => {
              return request(app)
                .get('/api/articles?sort_by=color')
                .expect(405)
                .then(({body: {msg}}) => {
                  expect(msg).toBe('No such column')
                })
            })
            test('404 - no such topic', () => {
              return request(app)
                .get('/api/articles?topic=jokes')
                .expect(404)
                .then(({body: {msg}}) => {
                  expect(msg).toBe('No such topic')
                })
            })
            test('404 - non-existent author', () => {
              return request(app)
                .get('/api/articles?author=vitalie')
                .expect(404)
                .then(({body: {msg}}) => {
                  expect(msg).toBe('User not found')
                })
            })
          })
        });
      });
      test("200 - responds with the required article by it's id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              article:
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
            });
          });
      });
      test('200 - more examples', () => {
        return request(app)
          .get('/api/articles/2')
          .expect(200)
          .then(({body}) => {
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
          })
      })
      describe('ERRORS', () => {
        test('405 - Method not found', () => {
          return request(app)
            .patch('/api/articles')
            .expect(405)
            .then(({body: {msg}}) => {
              expect(msg).toBe('Method not allowed')
            })
        })
        test('405 - more examples', () => {
          return request(app)
            .put('/api/articles/1')
            .expect(405)
            .then(({body: {msg}}) => {
              expect(msg).toBe('Method not allowed')
            })
        })
        test('404 - article id not found', () => {
          return request(app)
            .get('/api/articles/88')
            .expect(404)
            .then(({body: {msg}}) => {
              expect(msg).toBe('Article not found')
            })
        })
        test('more errors examples', () => {
          return request(app)
            .get('/api/articles/dog')
            .expect(405)
            .then(({body: {msg}}) => {
              expect(msg).toBe('Invalid text representation')
            })
        })
      })
    });
    describe("PATCH", () => {
      test("201 - patch request has been accepted by the necessary votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(201)
          .then(({ body }) => {
            expect(body).toEqual({
              article:
                {
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
      test('200 - patch request contains no body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send()
          .expect(200)
          .then(({body}) => {
            expect(body).toEqual({
              article:
                {
                  article_id: 1,
                  title: "Living in the shadow of a great man",
                  author: "butter_bridge",
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2018-11-15T12:21:54.171Z",
                  votes: 100,
                },
            })
          })
      })
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
            .then(({ body: {comment} }) => {
              expect(comment).toMatchObject({
                    comment_id: 19,
                    author: "rogersop",
                    article_id: 11,
                    votes: 0,
                    created_at: expect.any(String),
                    body: "Yes, although you look more like a donkey",
              });
            });
        });
        describe('ERRORS - POST', () => {
          test('400 - bad request if required keys aren\'t input', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .expect(400)
              .send({
                body: 'Hey mamma'
              })
              .then(({body: {msg}}) => {
                expect(msg).toBe('Please provide all the required keys')
              })
          })
        })
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
          test('more examples', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({body: { comments }}) => {
                expect(comments).toHaveLength(13)

                expect(comments).toBeSortedBy('created_at', {
                  descending: false
                })
              })
          })
          describe('ERRORS - Queries', () => {
            test('405 - not a valid column', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=country')
                .expect(405)
                .then(({body: {msg}}) => {
                  expect(msg).toBe('No such column')
                })
            })
          })
        });
        describe('ERRORS - GET', () => {
          test('404 - article doesn\'t exist', () => {
            return request(app)
              .get('/api/articles/1000/comments')
              .expect(404)
              .then(({body: {msg}}) => {
                expect(msg).toBe('Article not found')
              })
          })        
          test('405 - invalid article id', () => {
            return request(app)
              .get('/api/articles/uno/comments')
              .expect(405)
              .then(({body: {msg}}) => {
                expect(msg).toBe('Invalid text representation')
              })
          })
        })
      });
      describe('Errors - GENERAL', () => {
        test('405 - PUT request not allowed', () => {
          return request(app)
            .put('/api/articles/1/comments')
            .expect(405)
            .then(({body: {msg}}) => {
              expect(msg).toBe('Method not allowed')
            })
        })
      })
    });
  });
  describe('/comments', () => {
    describe('.../:comments_id', () => {
      describe('PATCH', () => {
        test('votes can be incremented', () => {
          return request(app)
            .patch('/api/comments/4')
            .expect(200)
            .send({inc_votes: 50})
            .then(({body: {comment}}) => {
              expect(comment).toEqual(
                {
                  comment_id: 4,
                  author: 'icellusedkars',
                  article_id: 1,
                  votes: -50,
                  created_at: '2014-11-23T12:36:03.389Z',
                  body: ' I carry a log — yes. Is it funny to you? It is not to me.'
                }
              )
            })
        })
        test('votes can be reduced', () => {
          return request(app)
            .patch('/api/comments/4')
            .expect(200)
            .send({inc_votes: -50})
            .then(({body: {comment}}) => {
              expect(comment).toEqual(
                {
                  comment_id: 4,
                  author: 'icellusedkars',
                  article_id: 1,
                  votes: -150,
                  created_at: '2014-11-23T12:36:03.389Z',
                  body: ' I carry a log — yes. Is it funny to you? It is not to me.'
                }
              )
            })
        })
      })
      describe('DELETE', () => {
        test('204 - comment has been deleted', () => {
          return request(app)
            .delete('/api/comments/4')
            .expect(204)
            .then(() => {
              return dbConnection
                .select('*')
                .from('comments')
                .where({
                  comment_id: 4
                })
            })
            .then((comment) => {
              expect(comment).toHaveLength(0)
            })
        })
      })
    })
  })
});
