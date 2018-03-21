# npm常用命令行工具解析

[![npm](https://img.shields.io/npm/v/npm.svg)](https://docs.npmjs.com/getting-started/what-is-npm)

*本文并未涵盖所有npm命令行工具，其它未提及内容参见官网。*
## npm doctor
运行一系列的环境检查，依赖工具是否安装，目录读写是否有权限等等。

        npm doctor

## npm init 

从当前目录初始化一个**node_module**，生成*package.json*文件。

        npm init [-f|--force|-y|--yes] [-scope]

## npm version
生成新的版本号并同步修改*package.json*和*npm-shrinkwrap.json*中的配置。
        
        npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

说明：
- 运行在*git*环境下可以生成版本提交记录。
- 使用*from-git*选项，将读取最新的*git tag*作为版本号。

## npm config

读取配置项，可以通过多种方式设定配置项，如命令行、环境变量、**.npmrc**、**package.json**或其它方式。

        npm config set <key> <value> [-g|--global]
        npm config get <key>
        npm config delete <key>
        npm config list [-l] [--json]
        npm config edit
        npm get <key>
        npm set <key> <value> [-g|--global]

        aliases: c

说明：
- 配置项的设定或者修改会同步更新到*user npmrc files*或者*global npmrc files*，不会更新*project npmrc files*。

## npm search 

模糊搜索registry中所有的*package meta*，找到和搜索项匹配的内容并高亮输出结果。

        npm search [-l|--long] [--json] [--parseable] [--no-description] [search terms ...]
        aliases: s, se, find

## npm view

查看*registry*中指定*package*的信息。

        npm view [--json] [<@scope>/]<name>[@<version>] [<field>[.<subfield>]...]
        aliases: info, show, v

## npm install

安装任意形式的**package**。

        npm install (with no args, in package dir)
        npm install [<@scope>/]<name>
        npm install [<@scope>/]<name>@<tag>
        npm install [<@scope>/]<name>@<version>
        npm install [<@scope>/]<name>@<version range>
        npm install <git-host>:<git-user>/<repo-name>
        npm install <git repo url>
        npm install <tarball file>
        npm install <tarball url>
        npm install <folder>

        alias: npm i
        common options: [-P|--save-prod|-D|--save-dev|-O|--save-optional] [-E|--save-exact] [-B|--save-bundle] [--no-save] [--dry-run] [-g|--global] [-f|--force]

说明：

  - --production , NODE_ENV环境变量设置为production时, npm不会安装devDependencies列表里的内容。
        
        NODE_ENV=production npm i <package>
  - --only={prod[uction]|dev[elopment]} 忽略**NODE_ENV**的设置，仅安装**devDependencies**或者**非devDependencies**对应的依赖。
  - -g|--global，把指定`<name>`的package或者当前package（未指定`<name>`时）安装至全局。
  - 如果当前目录下有和`<name>`相同的文件或者目录，则会先尝试安装本地文件再查找registry。
  - --dry-run 仅输出安装过程的结果，不进行本地安装。
  - -f|--force 忽略本地缓存，强制从远程更新资源。

安装路径：
- 全局安装
  - **_npm\_config\_prefix_/lib/node_module/**
  - **_npm\_config\_prefix_/bin/**
- 本地安装
  - **./node_module/**
  - **./node_module/bin/**

## npm uninstall 
移除包及其配置项。

        npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional|--no-save]
        aliases: remove, rm, r, un, unlink

说明：
- 移除包后，*package.json*等配置文件自动更新。

## npm ci

类似于不带参数的`npm i` ，用于自动化环境，如测试平台、CI或者项目部署。

        npm ci
说明：
- 工程必须有**package-lock.json** or **npm-shrinkwrap.json**
- **package.json**和*package lock*不一致会失败
- 一次安装所有依赖，不能安装单独的模块
- 安装前清空已有的*node_module*目录

## npm ls
以树状形式列出安装的所有依赖包，可用于查看包及其版本的安装情况。

        npm ls [[<@scope>/]<pkg> ...]
        aliases: list, la, ll
        common options: [-g|--global] [--json] [--long] [--parseable] [--prod] [--dev] [--only] [--link]

说明：
- 提供`<pkg>`参数时，该命令会深度遍历项目的依赖树，查找目标并输出依赖树上该包的层级关系。
- --depth=[0...] 指定输出的结果树层级
- [--prod|--dev] 仅输出在**dependencies**或**devDependencies**配置的包。

## npm run-script
运行配置在**package.json**里的包脚本。

        npm run-script <command> [--silent] [-- <args>...]
        alias: npm run

说明：
- 可以省略*run*直接调用的*script*有**test**, **start**, **restart**, and **stop**。
- 内置脚本**env**可以列出脚本运行时可用的环境变量，*env*可以被配置相同脚本名覆盖功能。
- 本地安装的**node_modules/.bin**中的可执行文件可以直接不加前缀调用(该目录在运行时会加到系统环境变量*PATH*)。
- *--* 可用于给脚本透传自定义参数，脚本必须通过**npm run**调用，并且不会传至*pre script 或 post script*。`npm run test -- --arg="val"`
- 环境变量中有特殊值**PWD**，**NODE**。

## npm start
运行*npm scripts*配置的*start*命令。

        npm start [-- <args>]

说明：
没有配置*start*命令时，默认执行 `node server.js`

## npm outdated
从**registry**处检查指定的包或者已安装的包是否过时。

        npm outdated [[<@scope>/]<pkg> ...]

说明：
- [-g|--global] 可以查看全局安装包。
- --depth 默认为0，只展示直接依赖包的情况。

## npm link
创建*pkg*的符号链接，处理过程包含两步：
1. 在全局文件夹创建包的符号链接。
   - 创建符号链接*{npm-config-prefix}/lib/node_modules/{package-name}*
   - 若提供*bin*文件配置，则创建符号链接*{npm-config-prefix}/bin/{bin-name}*
2. 在其它地方被*link*时，会在运行项目的目录创建该*pkg*符号链接至全局安装包。


        npm link (in package dir)
        npm link [<@scope>/]<pkg>[@<version>]
        
        alias: npm ln

说明：
- *package-name*和*bin-name*从包目录*package.json*中获取而不是目录名。
- 可以通过 `npm link ../local/path` 的形式link本地的开发包，包的处理过程不变。

## npm adduser
在指定或默认的*npm registry*服务中增加账号。

        npm adduser [--registry=url] [--scope=@orgname] [--always-auth] [--auth-type=legacy]
        aliases: login, add-user

说明：
- 身份校验时用户名、密码和邮箱三者必须和注册时一致。
- 新用户首次注册会发邮件要求验证邮箱。
- 验证成功后授权信息会保存到**.npmrc**文件中。

## npm publish
发布*package*到*npm registry*

        npm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>] [--otp otpcode]
        Publishes '.' if no argument supplied
        Sets tag 'latest' if no --tag specified

说明：
- 可以通过*.gitignore* or *.npmignore*文件来忽略指定的项目文件， *.npmignore*权重最大。
- 默认的*public tag*是**latest**
- 发布使用的*name*和*version*组合只能使用一次。

## npm dist-tag
管理包的发布tag

        npm dist-tag add <pkg>@<version> [<tag>]
        npm dist-tag rm <pkg> <tag>
        npm dist-tag ls [<pkg>]

        aliases: dist-tags

说明：
- `npm publish`会设置和发布版本号对应的*dist-tag*，**latest**，安装时也是取这个tag对应的版本。
- *dist-tag*开发阶段可以用来迭代不同的版本号
- 命名避免和版本号混淆

## npm deprecate
把指定包的特定版本或版本区间置为不推荐版本。

        npm deprecate <pkg>[@<version>] <message>

说明：
- 推荐以此取代`npm unpublish`
- 可以指定版本区间，如*my-thing@"< 0.2.3"*

## npm owner
管理*package*的owner。

        npm owner add <user> [<@scope>/]<pkg>
        npm owner rm <user> [<@scope>/]<pkg>
        npm owner ls [<@scope>/]<pkg>
        
        aliases: author

## npm token
管理当前用户相关的认证token。

        npm token list [--json|--parseable]
        npm token create [--read-only] [--cidr=1.1.1.1/24,2.2.2.2/16]
        npm token revoke <id|token>

说明：
- `npm login`认证成功后的授权token会保存至**~/.npmrc**
- 可以管理当前用户授权的所有token

## npm pack
创建一个指定*package*的*tarball*文件。

        npm pack [[<@scope>/]<pkg>...]

说明：
- 不指定参数时*package*默认为当前的*package*
- *tarball* 文件命名*\<name\>-\<version\>.tgz*
- 先下载*package*到*npm cache*目录，然后再拷贝到当前文件，每次调用会覆盖上一次内容。
- 打包的内容不包含*node_modules*目录。

## 一些打印输出的命令
没有特殊功能，仅作相关内容打印输出。

        npm bin [-g|--global] #输出npm安装可执行文件的目录
        npm prefix [-g|--global] #输出local prefix（从当前目录向上级查找包含 package.json 文件的目录）
        npm root [-g|--global] #输出有效的node_modules目录

