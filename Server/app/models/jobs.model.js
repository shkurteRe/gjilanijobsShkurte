const validator = require('validator');

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      title: {
        type: String,
        required: [true, 'required'],
      },
      industry: {
        type: String,
       // required: [true, 'required'],
      },
      minimum_age: {
        type: String,
        required: [true, 'required'],
      },
      maximum_age: {
        type: String,
        required: [true, 'required'],
      },
      type: {
        type: String,
        required: [true, 'required'],
      },
      priority: {
        type: String,
        enum: ['Normal', 'Urgent'],
        required: [true, 'required'],
      },
      starting_salary: {
        type: String,
        required: [true, 'required'],
      },
      address: {
        type: String,
        required: [true, 'required'],
      },
      zip_code: {
        type: String,
        required: [true, 'required'],
      },
      positions: {
        type: Number
      },
      description: {
        type: String,
        required: [true, 'required'],
      },
      status: {
        type: Number,
        default: 1, // 1 - Active, 2 - Inactive
      // required: [true, 'required'],
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("jobs", schema);
};