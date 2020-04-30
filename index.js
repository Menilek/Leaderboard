const express = require('express')
const redis = require('redis')
const axios = require('axios')

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

app.use(express.json());
app.set('view engine', 'pug');

//TODO: pass params to query for number of fighters
const getFighters = () => {
    try{
        let fighters = []
        axios.get('http://139.162.209.85:5000/api/5').then(res => {
            console.log('Retrieving data...')
    
            for(var i = 0; i < res.data.fighter.length; i++){
                var fighter = res.data.fighter[i];
                fighters.push(fighter)
            }
    
            grappler = fighters[2].grappling
            // console.log('Top Grappling Style: ' + grappler)
    
            let champ = fighters[0].name;
            console.log(champ)
            //Set data in Redis
            client.setex(champ, 3600, grappler)
    
            return(grappler);
        })
    } catch(error) {
        console.error(error)
    }
}

app.get('/', function(req, res){
    let fighter = getFighters()
        .then(res => {
            if(res.grappler){
                console.log("late:" + fighter)
                res.render('index', {title: 'Grappler', data: fighter})
            }
        })
        .catch(error => {
            console.log(error)
        })
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})