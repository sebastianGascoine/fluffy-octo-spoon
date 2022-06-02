const bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 10;

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

schema.pre('save', function(done) {
    const player = this;

    if (!player.isModified('password')) return done();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return done(err);

        bcrypt.hash(player.password, salt, () => {}, function (err, hashedPassword) {
            if (err) return done(err);

            player.password = hashedPassword;
            done();
        });
    });
});

schema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, (err, isMatch) => done(err, isMatch));
};

const Player = mongoose.model('Player', schema);

module.exports = Player;