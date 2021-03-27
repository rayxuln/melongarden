# 前端中所用到的API说明

## 说明

所有API调用相关函数放在`src/APIs/<API Name>/`文件夹下，
每个API为单独一个文件。

可在`src/APIs/index.ts`中设置要使用的API。

本质上调用API函数将返回一个`Promise`，
通过`Promise`的`resolve`传递API调用结果
通过`Promise`的`reject`传递API调用出错信息

测试时使用MockerAPI，在本地模拟了一个完整的后端，在每个API调用都会有1000ms的延迟用来模拟真实网络环境。

## 认证

认证信息储存在cookie中，在API调用时若需要用到认证信息，则直接传递cookie即可。

## 图片上传

帖子内容中非网络图片需要将图片数据上传到服务器中，并返回图片的网络地址。

当前为模拟图片上传，将图片数据转换为base64并编码为url返回。具体代码详见：`src/APIs/Tools.ts`中的`imagesUploadHandler`函数。

## API 列表

### checkToken ( )

功能：检查登录信息，返回用户名和用户头像url

参数：

```js

```

返回对象：

```js
{
    userName, // 用户名
    userAvatar // 用户头像url
}
```

### deletePostLevel (postId, level)

功能：删除帖子中的某一楼层，当删除的是第一楼时，则删除该帖子。返回是否将该帖子也删除了。

参数：

```js
postId // 帖子标识
level // 楼层索引（从1开始）
```

返回对象：

```js
{
    hasDeletePost // 是否删除了帖子
}
```

### editPostLevel (postId, level, content)

功能：编辑帖子中某一楼层的内容

参数：

```js
postId // 帖子标识
level // 楼层索引（从1开始）
content // 编辑后的内容（字符串, html代码）
```

返回对象：

```js

```

### getImagePostList ( pageSize, pageNumber, filter )

功能：获取含有图片帖子的列表，用于在images页面显示

参数：

```js
pageSize // 一页显示帖子的数量
pageNumber // 当前页码（从1开始）
filter // 搜索内容（字符串）
```

返回对象：

```js
{
    posts, // 当前页码中的帖子数据（数组，格式如下）
    postNum // 帖子总数（符合搜索条件的帖子数量）
}

// 帖子数据格式
{
    img, // 帖子中第一张图片的url，用于预览
    imgList, // 帖子中所有图片的url
    title, // 帖子标题 (字数不超过20)
    content, // 帖子1楼内容 (字数不超过25)
    userAvatar, // 发帖人的头像url
    userName, // 发帖人用户名
    postId // 帖子标识
}
```

### getMembersAndPosts ( )

功能：获取用户总数和帖子总数

参数：

```js

```

返回对象：

```js
{
    members, // 用户总数
    posts // 帖子总数
}
```

### getPostInfo ( postId )

功能：获取帖子的标题和楼层总数

参数：

```js
postId // 帖子标识
```

返回对象：

```js
{
    levelNum, // 楼层数
    title // 帖子标题
}
```

### getPostLevel ( postId, level )

功能：获取帖子中的某一楼的数据

参数：

```js
postId // 帖子标识
level // 楼层索引（从1开始）
```

返回对象：

```js
{
    level, // 楼层数据 (格式如下)
}

// 楼层数据格式
{
    userAvatarUrl, // 用户头像url
    userName, // 用户名
    content, // 楼层内容（字符串, html代码）
    level, // 楼层索引 (从1开始)
    date, // 楼层显示给用户看的日期 (字符串)
    hasEdited, // 是否编辑过
    hasLike, // 当前用户是否对该楼层点赞或者点踩（1为点赞，2为点踩，0为既没点赞也没点踩）
    likeNum, // 点赞数
    dislikeNum, // 点踩数
    isPoster, // 当前用户是否为该帖子的作者
    isLoading, // 是否正在加载 (总是为false即可)
    isAdmin, // 当前用户是否为管理员
    isPinned, // 当前帖子是否置顶
    isYou // 当前用户是否为该楼层的作者
}
```

### getPostLevelLikeInfo ( postId, level )

功能：获取帖子中某一楼层的点赞数和点踩数

参数：

```js
postId // 帖子标识
level // 楼层索引（从1开始）
```

返回对象：

```js
{
    hasLike, // 当前用户是否对该楼层点赞或者点踩（1为点赞，2为点踩）
    likeNum, // 点赞数
    dislikeNum // 点踩数
}
```

### getPostLevelList ( postId, pageSize, pageNumber, filter)

功能：获取帖子中的部分楼层数据

参数：

```js
postId // 帖子标识
pageSize // 一页显示的楼层数
pageNumber // 当前页码
filter // 搜索内容（字符串）
```

返回对象：

```js
{
    levels, // 楼层数据 (格式如下)
    levelNum // 楼层总数（在符合搜索条件的情况下）
}

// 楼层数据格式
{
    userAvatarUrl, // 用户头像url
    userName, // 用户名
    content, // 楼层内容（字符串, html代码）
    level, // 楼层索引 (从1开始)
    date, // 楼层显示给用户看的日期 (字符串)
    hasEdited, // 是否编辑过
    hasLike, // 当前用户是否对该楼层点赞或者点踩（1为点赞，2为点踩，0为既没点赞也没点踩）
    likeNum, // 点赞数
    dislikeNum, // 点踩数
    isPoster, // 当前用户是否为该帖子的作者
    isLoading, // 是否正在加载 (总是为false即可)
    isAdmin, // 当前用户是否为管理员
    isPinned, // 当前帖子是否置顶
    isYou // 当前用户是否为该楼层的作者
}
```

### getPostList ( pageSize, pageNumber, filter )

功能：获取帖子列表数据，用于在首页显示

参数：

```js
pageSize // 一页显示帖子的数量
pageNumber // 当前页码（从1开始）
filter // 搜索内容（字符串）
```

返回对象：

```js
{
    posts, // 当前页码中的帖子数据（数组，格式如下）
    postNum // 帖子总数（符合搜索条件的帖子数量）
}

// 帖子数据格式
{
    replyNum, // 回复数（即楼层数）
    title, // 帖子标题（不超过60字)
    titleTags, // 帖子标签数组 (格式如下)
    content, // 帖子1楼内容(不超过100字)
    poster, // 帖子作者用户名
    lastReplior, // 最后回复的用户名
    updateTime, // 帖子更新日期
    postId, // 帖子标识
    hasLike, // 当前用户是否对1楼点赞或者点踩（1为点赞，2为点踩，0为既没点赞也没点踩）
    likeNum, // 1楼点赞数
    dislikeNum, // 1楼点踩数
    images // 预览图片数组 (不超过3个元素，格式如下)
}

// 帖子标签格式
{
    type, // 标签颜色(字符串)('warning'为黄色, 'info'为灰色)
    tag // 标签内容(字符串)(如：'pin'表示置顶了，'Edited'表示编辑过的)
}

// 预览图片数据格式
// 表示的是同一张图片，小图用于预览，大图用于放大后查看
// 大图小图的url可以相等
{
    big, // 大图的url
    small // 小图的url
}
```

### getUserInfo ( )

功能：获取当前登录用户信息，用于在用户面板上显示

参数：

```js

```

返回对象：

```js
{
    userPostNum, // 用户发帖数
    userReplyNum, // 用户回复数
    userTags // 用户标签数组 (格式如下)
}

// 用户标签格式
{
    type, // 标签颜色(字符串)('warning'为黄色， 'info'为灰色，)
    tag // 标签内容(字符串)(如：'Admin'表示用户是管理员)
}
```

### likePostLevel ( postId, level, like )

功能：点赞帖子中的某一楼

参数：

```js
postId // 帖子标识
level // 楼层索引(从1开始)
like // 动作(1为点赞，2为点踩)
```

返回对象：

```js

```

### pinPost ( postId, pin )

功能：置顶或取消置顶帖子

参数：

```js
postId // 帖子标识
pin // 是否置顶
```

返回对象：

```js

```

### post ( title, content)

功能：发帖

参数：

```js
title // 帖子标题
content // 帖子内容 (字符串, html代码)
```

返回对象：

```js

```

### reply ( postId, content )

功能：回复帖子

参数：

```js
postId // 帖子标识
content // 回复内容 (字符串, html代码)
```

返回对象：

```js

```
