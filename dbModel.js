import mongoose from "mongoose";

const tiktokSchema = mongoose.Schema({
    url: String,
    channel: String,
    description: String,
    song: String,
    likes: String,
    comments: String,
    shares: String
})

const tiktokVideo = mongoose.model("tiktokVideo", tiktokSchema);

export default tiktokVideo;