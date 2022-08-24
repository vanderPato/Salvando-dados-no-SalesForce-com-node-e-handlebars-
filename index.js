const express = require('express')
const jsforce = require('jsforce')
const handlebars = require('express-handlebars');
require ('dotenv').config()
const app = express()
const PORT = 3001

const perm = handlebars.create({defaultLayout:'main',runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
},
})
app.engine('handlebars',perm.engine);


app.use('/', express.static(__dirname + '/'));



app.set('view engine', 'handlebars');

app.use(express.urlencoded({extends:false}));
app.use(express.json());


const {SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD ,SF_TOKEN} = process.env
const conn = new jsforce.Connection({
    loginUri:SF_LOGIN_URL
})
conn.login(SF_USERNAME, SF_PASSWORD+SF_TOKEN , (err, userInfor) =>{
    if(err){
        console.log('Erro aqui', err)
    }else{
        console.log('User id' , userInfor.id)
        console.log('Org id' , userInfor.organizationId)
    }
})



app.post('/teste', (req, res)=>{
   
    das = req.body;
    

   
        if(das.come =='' || das.come == null|| das.come == undefined ){
            conn.query("SELECT Id, Name FROM TrilhasFavorita__c",(err,result)=>{
                        if(result){
                            res.render('formulario_login', {result:result.records})
                        }
                    })
            console.log('aqui estou')
            
        }else{ 
        conn.query(`SELECT Id, 
                    Name ,
                    NomeModulo1__c ,
                    NomeModulo2__c , 
                    NomeModulo3__c ,
                    NomeModulo4__c , 
                    NomeModulo5__c FROM TrilhasFavorita__c WHERE  Name = '${das.come}'`,(err,result)=>{
        if(result){
            //map.set('Name', result.records)
            console.log('Total de Dados ' , result.totalSize)
            console.log('dados trazidos ' , {result:result})
            
            res.render('formulario_login', {result:result.records})
        }
     })
    }
})


app.get('/teste', async (req, res)=>{
    res.render('formulario_login')

})



app.post('/create', (req, res) =>{
    buscaForm = req.body

    if(buscaForm.nometrilha =='' || buscaForm.nometrilha == null|| buscaForm.nometrilha == undefined ){

        res.redirect('/create')
    }else{ 
       
    conn.sobject("TrilhasFavorita__c").create({Name : `${buscaForm.nometrilha} `,
                 NomeModulo1__c : `${buscaForm.nomemodulo1}`,
                 NomeModulo2__c : `${buscaForm.nomemodulo2}`,
                 NomeModulo3__c : `${buscaForm.nomemodulo3}`,
                 NomeModulo4__c : `${buscaForm.nomemodulo4}`,
                 NomeModulo5__c : `${buscaForm.nomemodulo5}`}, (err, ret)=>{
        if(err || !ret.success) {
            console.log('Es que ah um erro ', err)
            
        }else{
           
            conn.query(`SELECT Name, CreatedById, NomeModulo1__c FROM TrilhasFavorita__c WHERE Name = '${buscaForm.nometrilha}'LIMIT 1`, (err, result) =>{ 
                
          
                    console.log('teste aqui ', {novo:result.records})
                if(result){
                    console.log('passanmos do ', {novo:result.records})
                    res.render('formulario_create_records', {novo:result.records})
                }
                
                
                
     })
    
}
            

     
        

    } )
}

})


app.get('/create', (req, res) =>{
    res.render('formulario_create_records')

})





app.post('/create_curso' ,(req, res) =>{
    cursos = req.body
    conn.sobject("Curso__c").create({Name : `${cursos.nomecursos} `, ProgressoCurso__c: `${cursos.cursos1}`}, (err, ret)=>{
if(err || !ret.success) {
console.log('Es que ah um erro ', err)
}else{
    res.send('Tudo esta indo bem')
}


})

})






app.get('/create_curso', (req, res) =>{
    res.render('formulario_cursos');
})



   

            
           
    







app.listen(PORT, ()=>{

        console.log('Servidor ativado' , `http://localhost:${PORT}`)
    
})