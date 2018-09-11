// var passport = require('passport');
// var User = require('../Models/User.js');
// var LocalStrategy = require('passport-local').Strategy;

// passport.serializeUser(function(user, done){
//     done(null, user.userName);
// });

// passport.deserializeUser(function(name, done){
//     User.findOne({userName: name}, function(err, user){
//         if (err) {
//             throw err;
//         }
//         if (!user) {
//             return done(null, false);
//         } else {
//             return done(null, user)
//         }
//     });
// });

// // passport.use('local', new LocalStrategy({
// //     usernameField: 'userName',
// //     passwordField: 'passWord',
// //     passReqToCallback: true
// // }, function(req, userName, passWord, done){
// //     User.findOne({'userName':userName}, function(err, user){
// //         if(err){
// //             return done(err);
// //         } 
// //         if(user){
// //             return done(null, false, {message: 'User already in user.'});
// //         }
// //         var newUser = new User();
// //             newUser.userName = userName;
// //             newUser.passWord = newUser.encryptPassword(passWord);
// //             newUser.save(function(err, result){
// //                 if (err){
// //                     return done(err);
// //                 }
// //                 return done(null, newUser);
// //             })
// //     });
// // }));

// passport.use('local', new LocalStrategy((username, password, done) => {
//     User.find({userName: req.body.username}, function(err, user){
//         if (err) {
//             throw err;
//         }
//         if (!user) {
//             return done(null, false);
//         } else {
//             return done(null, user)
//         }
//     })
// }))