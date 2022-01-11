const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const slugify = require('slugify');

const app = express();

/*******************************************/
// configurações

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/noticias_node', {
    useNewUrlParser: true,
    UseUnifiedTopology: true})
.then(() => {
    console.log('Conexão com o mongoDB realizada com sucesso!');
}).catch((error) => {
    console.log(error.message);
});

/*******************************************/
// models

const Noticia = require('./models/Noticia');

/*******************************************/
// rotas

// setar página no objeto
app.get('/', (req, res) => {
    let busca = req.query.search;

    if(!busca){
        let setPage = 'home';

        Noticia.find({}).sort({'_id': -1}).then((news) => {
            Noticia.find().sort({'views': -1}).limit(4).then((viewestNews) => {
                res.render('index', {setPage, news, viewestNews});
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }else{
        let setPage = 'busca';

        Noticia.find({title: {$regex: busca, $options: 'i'}}).then((news) => {
            res.render('index', {setPage, news, busca});
        }).catch((error) => {
            console.log(error);
        });
    }
});

app.get('/noticia/:url', (req, res) => {
    let setPage = 'single';
    
    Noticia.findOneAndUpdate({url: req.params.url}, {$inc: {views: 1}}, {new: true}).then((news) => {
        if(news != null){
            Noticia.find().sort({'views': -1}).limit(4).then((viewestNews) => {
                res.render('index', {setPage, news, viewestNews});
            }).catch((error) => {
                console.log(error);
            });
        }
    }).catch((error) => {
        console.log(error);
    });
});

/*******************************************/
// configuração do servidor

const porta = 3000;

app.listen(porta, (error) => {
    if(error){
        console.log(error);
    }

    console.log('Servidor online!');
});