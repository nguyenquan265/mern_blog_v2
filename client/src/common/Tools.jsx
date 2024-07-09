import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import uploadImage from '../utils/uploadImage'

// Tools for EditorJS
const Tools = {
  embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [2, 3],
      defaultLevel: 2
    }
  },
  image: {
    class: Image,
    config: {
      uploader: {
        // Custom uploader
        async uploadByFile(file) {
          return uploadImage(file).then((res) => {
            return { success: 1, file: { url: res } }
          })
        }
      }
    }
  },
  inlineCode: InlineCode,
  list: {
    class: List,
    inlineToolbar: true
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolbar: true
  }
}

export default Tools
