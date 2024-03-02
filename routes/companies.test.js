process.env.NODE_ENV = "test"

const request = require("supertest")

const app = require("../app")
const db = require("../db")

beforeEach(function(){
    db.query(`INSERT INTO companies (code,name)
    VALUES ('Apple','Apple Computers'),('Micro','Microsoft')`)
})

afterEach(function(){
    db.query(`DELETE FROM companies WHERE code='Apple'`)
    db.query(`DELETE FROM companies WHERE code='Micro'`)
})

describe("GET /", function(){
    test("Get all the companies", async function(){
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({companies: [{code: "Apple",name: "Apple Computers",description:null},
        {code: "Micro",name: "Microsoft", description:null}]})
    })
})

describe("GET /:code", function(){
    test("Get one company", async function(){
        const res = await request(app).get('/companies/Apple')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company:{code: "Apple", name:"Apple Computers", description:null}})
    })
})

describe("POST /", function(){
    test("Make a company", async function(){
        const res = await request(app).post('/companies').send({code: "Guzik",name:"Guzik Inc.",description:"We make the best laundry machines"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company:{code: "Guzik",name:"Guzik Inc.",description:"We make the best laundry machines"}})
    })
})

describe("PUT /:code", function(){
    test("Adjust a company", async function(){
        const res = await request(app).put('/companies/Apple').send({name:"Apple Inc.", 
        description:"We make better computers than Microsoft"})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({company:{code:'Apple', name:"Apple Inc.", 
        description:"We make better computers than Microsoft"}})
    })
})

describe("DELETE /:code", function(){
    test("Delete a company", async function(){
        const res = await request(app).delete('/companies/Apple')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({status: "deleted"})
    })
})


