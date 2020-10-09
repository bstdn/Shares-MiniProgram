# 进击的钢小招题库

阿钢在进击答题赢积分答题题库

## 扫码体验

![小程序二维码](https://images.gitee.com/uploads/images/2020/1008/203829_da419f0a_1185106.jpeg "小程序二维码.jpg")

## 如何使用

### 注册开通小程序账号

https://mp.weixin.qq.com/

### 注册开通后台账号

https://admin.it120.cc/

1. 登录后台》工厂设置》模块管理》启用模块》微信小程序、Json数据存储接口、用户管理、CMS分类信息、系统参数
2. 后台》CMS模块》分类管理》添加“每日答题”分类（记住ID下面使用）
3. 后台》系统设置》系统参数》添加文本参数

编号 | 内容 | 备注
--- | --- | ---
answerSuccess | 感谢你的分享，请耐心等待审核通过，或联系作者处理\~(\*^_^*)~ | 提交答案成功提示
signTips | Oops. 你是否也经常忘记早上打没打卡？几点打了？现在你可以在这里记录下来\~ | 打卡页的提示
answerTips | 下拉可刷新;目前由个人每天更新招行答题答案，每天8:00\~10:00更新，如没更新，可联系作者催更，后续增加更多功能，请多多支持，谢谢\~(\*^_^*)~ | 每日答题页的提示
aboutMe | 本小程序答案来源于个人分享，答案仅供参考。如果您觉得不错，欢迎小伙伴给个赞赏或分享给同样玩招行积分的小伙伴吧\~ | 关于小程序
answerCategoryId | 13832 （改为自己的） | 每日答题分类id
signLogLength | 20 | 打卡页打卡记录条数
answerPageSize | 20 | 每日答题每页数
shareTitle | 招行每日答题答案分享 | 分享时标题
miniProgramName | 进击的钢小招题库 | 小程序名称

4. 后台》系统设置》系统参数》添加文件参数

编号 | 内容 | 备注
--- | --- | ---
imageStar | 上传赞赏码图片 | 赞赏码
imageAuthor | 上传微信二维码图片 | 加我微信

5. 添加域名 https://api.it120.cc;https://user.api.it120.cc

[《设置小程序合法服务器域名》](https://www.it120.cc/help/tvpou9.html)

6. 后台》微信设置》小程序设置》配置Appid / Secret

[《如何查看我的小程序的 APPID，在哪里看我的小程序的 APPID？》
](https://jingyan.baidu.com/article/642c9d340305e3644a46f795.html)

### 下载安装开发工具

https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html

#### 构建npm模块

```
npm install
```
小程序安装了npm模块，在开发工具：工具》构建npm，构建成功后，方可使用！

### 配置对接自己的后台

在开发工具中`config.js`中的`subDomain`改为你自己的专属城名，并保存

[《如何查看你自己的subDomain》](https://www.it120.cc/help/qr6l4m.html)

## 赞赏

**请作者喝杯咖啡吧！(微信号/QQ号：99808359)**

<img width="236" alt="微信扫一扫" src="https://images.gitee.com/uploads/images/2019/1122/203838_862f04ff_1185106.jpeg">

# 授权协议

[MIT License](LICENSE)