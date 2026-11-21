# 未央56 · 男生节祝福领取页

线上地址：<https://bzqybb.github.io/weiyang56-boysday/>
现场大屏：<https://bzqybb.github.io/weiyang56-boysday/stage.html>

一个手机优先的静态页面：输入姓名，播放约 7 秒的拆礼物动画，然后展开对应的手绘贺图，可查看大图、下载原图和复制祝福。

## 本地预览

```powershell
cd "D:\zhangqianyue\大二秋\学校杂事\男生节\gift-site"
python -m http.server 8765
```

打开 <http://127.0.0.1:8765/>。

> 直接用 `file://` 打开也能看，但下载、剪贴板等能力会受浏览器限制，建议用本地静态服务预览。

## 页面

- `index.html`：领取页。
- `stage.html`：现场大屏模式。点“播放祝福动画”后全屏播放 7 秒，再显示领取页二维码。
  - `stage.html?view=qr`：直接显示二维码。
  - `stage.html?view=show`：直接播放动画。
- `?to=姓名`：打开后自动进入该同学的拆礼动画；加 `&instant=1` 可直接看结果页（方便测试）。
- `?name=姓名`：同 `to`。

二维码只是打开本页的快捷方式，不是领取资格校验。把普通链接直接发到班群，大家同样可以输入姓名领取。

## 图片加载策略

- 首页不加载任何贺图。
- 输入姓名后，只加载该同学的 720px WebP 预览图（约 130–190 KB）。
- “查看大图”和“下载原图”才会请求 1024×1536 的 PNG 原图（约 2.2–2.6 MB）。
- 下载文件名固定为 `姓名_男生节快乐.png`。
- 27 位同学各有一条独立寄语，写在 `app.js` 的 `WISHES` 中；复制祝福时会带上对应那一条。
- 27 张原图共约 64 MB（含预览与缩略图约 70 MB），未在首屏加载。

## 目录

```text
index.html / styles.css / app.js       领取页
stage.html / stage.css / stage.js      现场大屏
data/manifest.js                       按姓名查找图片的索引（页面直接加载）
data/manifest.json                     同一份索引的可读副本
assets/full/*.png                      27 张原图
assets/preview/*.webp                  720px 展示预览
assets/thumb/*.webp                    预览加载失败时的 360px 兜底
assets/fonts/*.woff2                   页面用到的中文字体子集
assets/vendor/qrcode.min.js            本地二维码库
```

## 更新名单或图片

1. 把新图按“姓名.png”放进 `成品.zip`（或替换 `assets/full/` 中对应文件）。
2. 改 `data/manifest.json` 与 `data/manifest.js` 中对应的 `name`、`id`、`orig`、`preview`。
3. 重新生成 `assets/preview/` 和 `assets/thumb/` 中的 WebP。
4. 确认 27 个姓名与班里名单一致。

`gift-site-source/` 保存了字体源文件和生成脚本所需的中间文件，不参与网页发布。

## 字体与第三方

- 标题：庞门正道粗书体（免费商用，见 `assets/fonts/NOTICE-PangMen.txt`）。
- 正文：LXGW WenKai / 霞鹜文楷，SIL OFL 1.1（见 `assets/fonts/OFL-LXGWWenKai.txt`）。
- 二维码：qrcode-generator，MIT（见 `assets/vendor/LICENSE-qrcode-generator.txt`）。
- 页面不使用外部 CDN，断网也能正常打开（二维码生成除外，库已本地化）。

## 隐私

页面只做姓名到图片的本地匹配，不上传姓名，不接后端，不写数据库。
`robots.txt` 与页面 meta 均已设置 noindex，避免被搜索引擎收录。
