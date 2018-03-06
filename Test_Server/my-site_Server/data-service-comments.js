//install mongoose --> npm install --save mongoose
const mongoose = require( 'mongoose' );


//Create a schema
let Schema = mongoose.Schema;
var contentSchema = new Schema( {
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "poseteDate": Date,
    "replies": [ 
        {
            "comment_id": String,
            "authorName": String,
            "authorEmail": String,
            "commentText": String,
            "repliedDate": Date
        }
     ]
} );

//Upon initialization, this become type Comment and the Schema will apply
let Comment;
var dbUrl = "mongodb://janthony:12345678@ds249787.mlab.com:49787/test_comments";

module.exports.initialize = function() {
    return new Promise( (resolve, reject) => {
        let db = mongoose.createConnection( dbUrl, { useMongoClient: true } );

        db.on( "error", err => { reject( err ); } );

        db.once( "open", () => {
            Comment = db.model( "comment", contentSchema );
            resolve();
        } );
    } );
}

module.exports.addComment = function( data ) {
    return new Promise( (resolve, reject) => {
        data.postedDate = Date.now();

        let newComment = new Comment( data );

        newComment.save( err => {
            if( err ) { reject( "There was an error saving the comment: " + err ); }
            else { resolve( newComment._id ); }
        } );
    } );
}

module.exports.getAllComments = function() {
    return new Promise( (resolve, reject) => {
        Comment.find()
        .sort( { postedDate: "asc" } )
        .exec()
        .then( comments => { resolve( comments ); } )
        .catch( err => { reject( err ); } );
    } );
}

module.exports.addReply = function( data ) {
    return new Promise( ( resolve, reject ) => {
        data.repliedDate = Date.now();

        Comment.update( 
            { _id: data.comment_id },
            { $addToSet: { replies: data } } 
        )
        .exec()
        .then( () => { resolve(); } )
        .catch( err => { reject( err ); } );
    } );
}