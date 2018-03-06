const express = require('express');
const app = express();
const path = require('path');
const HTTP_PORT = process.env.PORT || 8081;
const bodyParser = require('body-parser');
const dataServiceComments = require('./data-service-comments.js');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post("/postTest", (req, res) => {
    res.json(req.body);
});

app.get( "/contact", ( req, res ) => {
    res.sendFile( path.join( __dirname + "/public/contact.html" ) );
    dataServiceComments.getAllComments()
    .then( comments => { res.render( "about", { data: comments } ); } )
    .catch( () => { res.render( "about" ); } );
} );

app.post( "/contact/addComment", ( req, res ) => {
    dataServiceComments.addComment( req.body )
    .then( () => { res.redirect( "/contact" ); } )
    .catch( err => { 
        console.log( err );
        res.redirect( "/contact" );
    } );
} );

app.post( "/about/addReply", ( req, res ) => {
    dataServiceComments.addReply( req.body )
    .then( () => { res.redirect( "/contact" ); } )
    .catch( err => {
        console.log( err );
        res.redirect( "/contact" );
    } );
} );


//app.listen( HTTP_PORT, () => { console.log( "Listening on: " + HTTP_PORT ); } );

dataServiceComments.initialize()
.then( () => { app.listen( HTTP_PORT, () => { console.log( "Listening on: " + HTTP_PORT ); } ) } )
.catch( err => { console.log( err ); } );