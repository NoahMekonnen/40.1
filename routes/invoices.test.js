process.env.NODE_ENV = "test"

const request = require("supertest")

const app = require("../app")
const db = require("../db")

beforeEach(function(){
    db.query(`INSERT INTO companies (code)
    VALUES (Apple),(Micro)`)
    db.query(`INSERT INTO invoices (compt_code,amt)
    VALUES (Micro,1500),(Apple,2500)`)
})


describe("GET /", function(){
    test("Get all the invoices", async function(){
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: ["Apple","Micro"]})
    })
})