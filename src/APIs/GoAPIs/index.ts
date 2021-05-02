import getMembersAndPosts from './getMembersAndPosts'
import getPostList from './getPostList.js'
import checkToken from './checkToken.js'
import signin from './signin.js'
import logout from './logout.js'
import getUserInfo from './getUserInfo.js'
import signup from './signup.js'
import getPostInfo from './getPostInfo.js'
import getPostLevelList from './getPostLevelList.js'
import getPostLevel from './getPostLevel.js'
import checkNewMessage from './checkNewMessage.js'
import getUserMessageList from './getUserMessageList.js'
import post from './post.js'
import reply from './reply.js'
import editPostLevel from './editPostLevel.js'
import deletePostLevel from './deletePostLevel.js'
import getTitleImage from './getTitleImage.js'
import likePostLevel from './likePostLevel.js'
import getPostLevelLikeInfo from './getPostLevelLikeInfo.js'
import setUserInfo from './setUserInfo.js'
import resetPassword from './resetPassword.js'
import deleteUser from './deleteUser.js'
import getImagePostList from './getImagePostList.js'
import imageUploadHandler from './imageUploadHandler.js'

function emptyPromise () {
  return () => {
    return new Promise((resolve, reject) => {
      reject(new Error('Using empty API.'))
    })
  }
}

export default {
  getMembersAndPosts,
  getPostList,
  checkToken,
  post,
  getPostInfo,
  getPostLevelList,
  reply,
  editPostLevel,
  getPostLevel,
  deletePostLevel,
  likePostLevel,
  getPostLevelLikeInfo,
  getUserInfo,
  pinPost: emptyPromise(),
  getImagePostList,
  signin,
  signup,
  getTitleImage,
  logout,
  setUserInfo,
  resetPassword,
  deleteUser,
  checkNewMessage,
  getUserMessageList,
  getUserPostList: emptyPromise(),
  getUserPostLevelList: emptyPromise(),
  imageUploadHandler
}
