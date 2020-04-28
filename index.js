const express = require('express')
const redis = require('redis')
const axios = require('axios')

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

app.use(express.json());
app.set('view engine', 'pug');

getFighters = () => {
    let fighters = []
    axios.get('http://139.162.209.85:5000/api/').then(res => {
        console.log('Retrieving data...')

        for(var i = 0; i < res.data.fighters.length; i++){
            var fighter = res.data.fighters[i];
            fighters.push(fighter)
        }

        grappler = fighters[9].grappling
        // console.log('Top Grappling Style: ' + grappler)

        //Set data in Redis
        client.setex(champ, 3600, grappler)

        return(grappler);
    })
}

app.get('/', function(req, res ){
    let fighter = getFighters()
    console.log("late:" + fighter)
    res.render('index', {title: 'Grappler', data: fighter})
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})