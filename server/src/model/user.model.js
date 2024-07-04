import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { emailRegex, passwordRegex } from '~/utils/regex'

let profile_imgs_name_list = [
  'Garfield',
  'Tinkerbell',
  'Annie',
  'Loki',
  'Cleo',
  'Angel',
  'Bob',
  'Mia',
  'Coco',
  'Gracie',
  'Bear',
  'Bella',
  'Abby',
  'Harley',
  'Cali',
  'Leo',
  'Luna',
  'Jack',
  'Felix',
  'Kiki'
]
let profile_imgs_collections_list = [
  'notionists-neutral',
  'adventurer-neutral',
  'fun-emoji'
]

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, 'Fullname must be 3 letters long']
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: {
          validator: function (v) {
            return emailRegex.test(v)
          },
          message: (props) => `${props.value} is not a valid email`
        }
      },
      password: {
        type: String,
        required: true,
        select: false,
        minlength: [6, 'Password must be 6 letters long'],
        validate: {
          validator: function (v) {
            return passwordRegex.test(v)
          },
          message: (props) => `${props.value} is not a valid password`
        }
      },
      username: {
        type: String,
        minlength: [3, 'Username must be 3 letters long'],
        unique: true
      },
      bio: {
        type: String,
        maxlength: [200, 'Bio should not be more than 200'],
        default: ''
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`
        }
      }
    },
    social_links: {
      youtube: {
        type: String,
        default: ''
      },
      instagram: {
        type: String,
        default: ''
      },
      facebook: {
        type: String,
        default: ''
      },
      twitter: {
        type: String,
        default: ''
      },
      github: {
        type: String,
        default: ''
      },
      website: {
        type: String,
        default: ''
      }
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0
      },
      total_reads: {
        type: Number,
        default: 0
      }
    },
    google_auth: {
      type: Boolean,
      default: false
    },
    blogs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Blog',
      default: []
    }
  },
  {
    timestamps: {
      createdAt: 'joinedAt'
    }
  }
)

// encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('personal_info.password')) return next()

  this.personal_info.password = await bcryptjs.hash(
    this.personal_info.password,
    12
  )
  next()
})

// Compare password
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.personal_info.password)
}

// export user schema
const User = mongoose.model('User', userSchema)

export default User
