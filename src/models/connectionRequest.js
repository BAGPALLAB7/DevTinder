import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "pending", "ignored", "interested"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(`You can't send request to yourself!`)
}
next()
})


const connectionRequestModel = new mongoose.model("connectionRequest", connectionRequestSchema);

export default connectionRequestModel;