import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blog'
    },
    blog_author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blog'
    },
    comment: {
      type: String,
      required: true
    },
    children: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment'
    },
    commented_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User'
    },
    isReply: {
      type: Boolean,
      default: false
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  {
    timestamps: {
      createdAt: 'commentedAt'
    }
  }
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
