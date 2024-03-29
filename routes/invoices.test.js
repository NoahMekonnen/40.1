process.env.NODE_ENV = "test"

const request = require("supertest")

const app = require("../app")
const db = require("../db")

beforeAll(function(){
    db.query(`INSERT INTO companies (code,name)
    VALUES ('Apple','Apple Computers'),('Micro','Microsoft')`)
    db.query(`INSERT INTO invoices (comp_code,amt,paid,add_date,paid_date)
    VALUES ('Apple',2500,true,'2017-07-10T04:00:00.000Z','2018-07-10T04:00:00.000Z'),
    ('Micro',1500,false,'2013-04-10T04:00:00.000Z','2013-07-10T04:00:00.000Z')`)
})

afterAll(function(){
    db.query(`DELETE FROM companies WHERE code='Apple'`)
    db.query(`DELETE FROM companies WHERE code='Micro'`)
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
        expect(res.body).toEqual({invoice: {id: 1, amt: 2500, paid: true, add_date: "2017-07-10T04:00:00.000Z",
        paid_date: "2018-07-10T04:00:00.000Z" }})
    })
})

describe("POST /", function(){
    test("Make an invoice", async function(){
        const res = await request(app).post('/invoices').send({comp_code: "Apple",amt: 500})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: {id: 3, comp_code: "Apple", amt: 500, paid: false, add_date: "2024-03-02T05:00:00.000Z",
        paid_date:null}})
    })
})

describe("PUT /:id", function(){
    test("Adjust an invoice", async function(){
        const res = await request(app).put('/invoices/1').send({amt: 2000})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({invoice: {id: 1, comp_code: "Apple", amt: 2000, paid: true, add_date: "2017-07-10T04:00:00.000Z",
        paid_date: "2018-07-10T04:00:00.000Z" }})
    })
})

describe("DELETE /:id", function(){
    test("Delete an invoice", async function(){
        const res = await request(app).delete('/invoices/1')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({status: "deleted"})
    })
})

describe("GET /companies/:code", function(){
    test("Get a company", async function(){
        const res = await request(app).get('/invoices/companies/Micro')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company:{code:"Micro", name: "Microsoft", description:null, invoices: [2]}})
    })
})
