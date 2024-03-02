process.env.NODE_ENV = "test"

const request = require("supertest")

const app = require("../app")
const db = require("../db")

beforeEach(function(){
    db.query(`INSERT INTO companies (code,name)
    VALUES (Apple,Apple Computers),(Micro,Microsoft)`)
    db.query(`INSERT INTO invoices (comp_code,amt,paid,add_date,paid_date)
    VALUES (Apple,2500,true,10-07-2017,10-07-2018),(Micro,1500,false,10-04-2013)`)
})

afterEach(function(){
    db.query(`DELETE FROM companies WHERE code=Apple`)
    db.query(`DELETE FROM companies WHERE code=Micro`)
})

describe("GET /", function(){
    test("Get all the invoices", async function(){
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoices: [{id: 1, comp_code: "Apple"},{id: 2,comp_code: "Micro"}]})
    })
})

describe("GET /:id", function(){
    test("Get one invoice", async function(){
        const res = await request(app).get('/invoices/1')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: [{id: 1, comp_code: "Apple", amt: 2500, paid: true, add_date: "10-07-2017",
        paid_date: "10-07-2018" }]})
    })
})

describe("POST /", function(){
    test("Make an invoice", async function(){
        const res = await request(app).post('/invoices').send({compt_code: "Apple",amt: 500})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: [{id: 3, comp_code: "Apple", amt: 500, paid: false, add_date: "03-01-2024"}]})
    })
})

describe("PUT /:id", function(){
    test("Adjust an invoice", async function(){
        const res = await request(app).put('/invoices/1').send({amt: 2000})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: [{id: 1, comp_code: "Apple", amt: 2000, paid: true, add_date: "10-07-2017",
        paid_date: "10-07-2018" }]})
    })
})

describe("DELETE /:id", function(){
    test("Delete an invoice", async function(){
        const res = await request(app).delete('/invoices/2')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({status: "deleted"})
    })
})

describe("GET /companies/:code", function(){
    test("Get a company", async function(){
        const res = await request(app).get('/invoices/companies/Micro')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({code:"Micro", name: "Microsoft", invoices: [1]})
    })
})
