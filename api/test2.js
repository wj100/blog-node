const express = require('express')
const router = express.Router()

router.get('/getBlog', async(req, res, next) => {
    try {
        console.log('查bloG', req.body)
        // const addSqlParams = [req.body.title,req.body.content];
        console.log('--------------------');
        console.log(req.path);
        const result = await query(`SELECT * FROM article WHERE id=17`);
        console.log('查到', result)
        let data=JSON.parse(JSON.stringify(result))
        console.log('-----------------------------')
        console.log(data)
        res.json({code: 200,data:data})
        // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
})

const query = require('../database/init')
router.post('/postText', async (req, res, next) => {
    try {
        console.log('post提交数据', req.body)
        const addSqlParams = [req.body.title,req.body.content];
        console.log('--------------------');
        console.log(req.path);
        const result = await query(`INSERT INTO article(title,content) VALUES(?,?)`, addSqlParams);
        console.log('插入文字', result)
        res.json({code: 200}) // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
});

module.exports = router;
