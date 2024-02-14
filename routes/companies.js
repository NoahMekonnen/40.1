const express = require("express")
const db = require("../db")
const ExpressError = require("../expressError")
const router = express.Router()

app.use(express.json())

router.get('/', async (req,res,next)=>{
    const result = await db.query("SELECT * FROM companies")
    return res.json({companies: result.rows})
})

router.get('/:code', async (req,res,next) => {
    const code = req.params.code
    const result = await db.query("SELECT * FROM WHERE id=$1", [code])
    if (result){
        return res.json({company: result.rows[0]})
    }
    else{
        throw new ExpressError("Not Found",404)
    }
})

router.post('/', async (req,res,next) => {
    const {code, name, description } = req.body
    const result = await db.query(`INSERT INTO companies (code)
                                    VALUES ($1)`,[code] )
    return res.json({company: {code: code, name: name, description: description}})                              
})

router.put('/:code', async (req,res,next) =>{
    const code = req.params.code
    const {name, description} = req.body
    const result = await db.query(`UPDATE companies SET name=$1, description=$2
                                    WHERE code=$3 RETURNING *`
                                    ,[name, description, code])
    if (result){
    return res.json({company: result.rows[0] })
    }
    else{
        throw new ExpressError("Not Found",404)
    }

})

router.delete('/:code', async (req,res,next) => {
    const code = req.params.code
    const result = await db.query(`DELETE FROM companies WHERE code=$1`,[code])
    if (result){
    return res.json({status:"deleted"})
    }
    else{
        throw new ExpressError("Not Found",404)
    }
})

app.listen(3000, function () {
    console.log('App on port 3000');
})

module.exports = router