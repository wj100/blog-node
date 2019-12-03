const express = require('express');
const router = express.Router();
const query = require('../database/init');

//用户登录
router.post('/login', async (req, res, next) => {
    try {
        console.log('database', req.body)
        const data = req.body
        const username = data.username
        const password = data.password
        const result = await query(`SELECT * FROM user WHERE username = ?`, [username]);
        if (result.length === 0) {
            res.json({code: 500, message: '用户不存在'})
        } else if (result[0].password !== password) {
            res.json({code: 500, message: '密码错误'})
        } else {
            req.session.userInfo = {id: result[0].username}
            console.log(req.session.userInfo);
            res.json({code: 200, message: '登陆成功', role: "admin"})
        }
    } catch (err) {
        throw new Error(err)
    }
});
//获取文章列表
router.get('/getList', async (req, res, next) => {
    try {
        console.log('---------查询参数为-----------');
        let type = req.query.type;
        console.log(type);
        const result1 = await query("select * from article");
        const result2 = await query(`SELECT * FROM article WHERE type = ?`, [type]);
        let result=type===""?result1:result2
        console.log('查到', result)
        let data = JSON.parse(JSON.stringify(result.reverse()));
        console.log('-----------------------------');
        console.log(data);
        res.json({code: 200, data: data})
        // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
});
//获取文章详情
router.get('/getArticle', async (req, res, next) => {
    try {
        console.log('--------------------');
        let id = req.query.id;
        console.log(req.path);
        const result = await query("select * from article where id='" + id + "'");
        console.log('查到', result);
        let data = JSON.parse(JSON.stringify(result[0]));
        console.log('-----------------------------');
        console.log(data);
        res.json({code: 200, data: data})
        // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
});
//删除文章
router.get('/delArticle', async (req, res, next) => {
    try {
        console.log('--------------------');
        let id = req.query.id;
        console.log(req.path);
        // delete from ui10_student where id = 5;删除id=5的记录
        const result = await query("delete from article where id='" + id + "'");
        console.log('删除', result.affectedRows);
        if (result.affectedRows===1){
            const newList=await query("select * from article");
            let data = JSON.parse(JSON.stringify(newList.reverse()));
            res.json({code: 200, message: result.affectedRows,newList:data})
        }

    } catch (err) {
        throw new Error(err)
    }
});
//获取评论
router.get('/getComment', async (req, res, next) => {
    try {
        console.log('--------------------');
        let id = req.query.articleId;
        console.log(req.path);
        const result = await query("select * from comment where article_id='" + id + "'");
        console.log('查询评论', result);
        let data = JSON.parse(JSON.stringify(result));
        console.log('-----------------------------');
        console.log(data);
        res.json({code: 200, data: data})
    } catch (err) {
        throw new Error(err)
    }
});

//提交文章
router.post('/postArticle', async (req, res, next) => {
    try {
        console.log('post提交数据', req.body);
        let time= new Date();
        const addSqlParams = [req.body.title, req.body.author,formatDateTime(time),req.body.type,req.body.content];
        console.log('--------------------');
        console.log(req.path);
        const result = await query(`INSERT INTO article(title,author,time,type,content) VALUES (?,?,?,?,?)`, addSqlParams);
        console.log('插入文字', result);
        res.json({code: 200,message:"发布文章成功!"}) // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
});
//提交评论
router.post('/postComment', async (req, res, next) => {
    try {
        console.log('post提交数据', req.body);
        let time= new Date();
        const addSqlParams = [req.body.position,req.body.articleId, req.body.commentText,formatDateTime(time)];
        console.log('--------------------');
        console.log(req.path);
        const result = await query(`INSERT INTO comment(position,article_id,comment_text,comment_time) VALUES (?,?,?,?)`, addSqlParams);
        console.log('插入comment', result);
        res.json({code: 200}) // res.send('ok')
    } catch (err) {
        throw new Error(err)
    }
});

//搜索文章
router.post('/searchArticle', async (req, res, next) => {
    try {
        console.log('搜索关键字', req.body);
        const keyWord = [req.body.keyWord];
        console.log('--------------------');
        console.log(req.path);
        // LIKE '%"+"张三"+"%'"
        // "select * from article where id='" + id + "'";
        const result = await query("SELECT * FROM article WHERE title LIKE '%"+keyWord+"%'");
        console.log('查到', result);
        let data = JSON.parse(JSON.stringify(result));
        if(data.length===0){
            res.json({code: 500,message:"暂时查不到"})
        }else {
            res.json({code: 200,data:data})
        }
    } catch (err) {
        throw new Error(err)
    }
});


/*new Date()转时间格式,到秒
* @params date
* return  str
* */
function formatDateTime(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second=date.getSeconds();
    second=second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}
module.exports = router;
