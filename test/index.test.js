// const { Test } = require("supertest");
// const request = require("supertest");
// //import database from "../database/index";
// const database = require("../database/index");
// //const createServer = require("../server")
// import createServer from "../server";
// const app = require("../server");


// // beforeAll(() => {
// //     database.release();
// // });

// describe("GraphQL API", ()=>{
//     test("Register a user", async(done)=>{
//         const query = `mutation {
//             register(payload: {
//               email: "boringcreati@gmail.com",
//               password: "Coding3719.",
//               name: "Saviour Essien",
//               phone: "07034696973",
//               country: "Nigeria"
//             })
//             {
//                 data,
//                 message,
//                 success
//                 token
//             }
//           }`
//         const response = await request(createServer).post("/graphql").set('Content-Type', 'application/json')
//         .set('Accept', 'application/json') 
//         .send({query: query});
//         console.log(response);
//         expect(response.statusCode).toBe(200);
//         //expect(JSON.parse(response.text).errors).toEqual(true);
//         done();
//     })
// })

import { should, use, expect }  from "chai";
const chaiHTTP = require("chai-http");
const app = require("../server");
const url = `http://localhost:4000/`;
const request = require('supertest')(url);
should();
use(chaiHTTP);

describe("GraphQL API", () => {
    describe("Create a user", () => {
        it("It should CREATE a user", (done) => {
            const query = `mutation {
                register(payload: {
                    email: "boringcreativeseb@gmail.com",
                    password: "Coding3719.",
                    name: "Saviour Essien",
                    phone: "07034696973",
                    country: "Nigeria"
                })
                {
                    data,
                    message,
                    success
                    token
                }
            }`
            request.post("/graphql")
            .send({ query: query })
            .end((err, response) => {
                response.body.data.register.should.to.include({"success": true});
                response.body.data.register.token.should.to.be.a("string");
                response.body.data.register.should.to.include({"message": "Successfully registered on Fidia 👏🏾👏🏾👏🏾"})  
                done();
            })
        })
    });

    describe("Don't create user", () => {
        it("It should not CREATE a user", (done) => {
            const query = `mutation {
                register(payload: {
                    email: "boringcreativeseb@gmail.com",
                    password: "Coding3719.",
                    name: "Saviour Essien",
                    phone: "07034696973",
                    country: "Nigeria"
                })
                {
                    data,
                    message,
                    success
                    token
                }
            }`
            request.post("/graphql")
            .send({ query: query })
            .end((err, response) => {
                response.body.data.register.should.to.include({"data": null});
                response.body.data.register.should.to.include({"message": "Sorry, there exists an account with this email."});
                response.body.data.register.should.to.include({"success": false});
                done();
            })
        })
    });



    describe("Login user", () => {
        it("It should LOGIN a user", (done) => {
            const query = `mutation {
                login(payload: {
                  email: "boringcreatives@gmail.com",
                  password: "Coding3719.",
                })
                {
                  data,
                  message,
                  success
                  token
                }
            }`
            request.post("/graphql")
            .send({ query: query })
            //.expect(300)
            .end((err, response) => {
                response.body.data.login.should.to.include({"message": "Successfully logged in to Fidia 👏🏾👏🏾👏🏾"});
                response.body.data.login.token.should.to.be.a("string");
                response.body.data.login.should.to.include({"success": true});
                done();
            })
        })
    })


    describe("Don't Login user", () => {
        it("It should NOT LOGIN an UNVERIFIED user", (done) => {
            const query = `mutation {
                login(payload: {
                  email: "boringcreatives@gmail.com",
                  password: "Coding3719.",
                })
                {
                  data,
                  message,
                  success
                  token
                }
            }`
            request.post("/graphql")
            .send({ query: query })
            //.expect(300)
            .end((err, response) => {
                response.body.data.login.should.to.include({"message": "👀 Sorry, login failed! 👀, are you sure this is your account? or you neva sign up 🌚?"});
                response.body.data.login.should.to.include({"data": null});
                response.body.data.login.should.to.include({"token": null});
                response.body.data.login.should.to.include({"success": false});
                done();
            })
        })
    })

    describe("List USER", () => {
        it("It should LIST ALL REGISTERED USERS", (done) => {
            const query = `query {
                listUsers {
                  data {
                    id,
                    name,
                    email,
                    country,
                  }
                }
              }`
            request.post("/graphql")
            .send({ query: query })
            .end((err, response) => {
                response.body.data.listUsers.should.to.include({"message": "⚡️ Fetched all users successfully 🚀"});
                response.body.data.listUsers.should.to.include({"success": true});
                response.body.data.listUsers.data.should.to.be.a("array");
                done();
            })
        })
    })
});
