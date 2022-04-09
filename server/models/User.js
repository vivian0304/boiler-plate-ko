const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this; // userSchema를 가리킴
    // 비밀번호를 암호화 시키다

    if(user.isModified('password')){ // password가 수정되는 경우에만 암호화하도록 설정

        bcrypt.genSalt(saltRounds, function(err, salt) { // salt 생성
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) { // 위에서 생성한 salt
                // hash : 암호화된 비밀번호
                if(err) return next(err);
                user.password = hash; // 암호화된 비밀번호로 변경
                next();
            });
        }); 
    } else {
        next();
    }
})

// comparePassword라는 이름은 index.js에서 쓸 이름과 동일하게 내 맘대로 지으면 됨
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token, 'secretToken', function(err, decoded){
        user.findOne({"_id":decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User}