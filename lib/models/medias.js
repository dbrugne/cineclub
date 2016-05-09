const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: { type: String },
  path: { type: String },
  created: { type: Date },
  new: { type: Boolean },
  removed: { type: Boolean },
  removed_at: { type: Date },
  data: mongoose.Schema.Types.Mixed,
});

Schema.statics.fastList = function () {
  return this.find({ removed: { $ne: true } })
    .sort({ _id: 1 })
    .limit(500)
    .exec();
};

module.exports = mongoose.model('Media', Schema);
