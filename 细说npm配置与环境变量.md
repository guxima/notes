# npm里的配置与环境变量

[![npm](https://img.shields.io/npm/v/npm.svg)](https://docs.npmjs.com/getting-started/what-is-npm)

在npm工程*pkg*目录下运行`npm run env`，会得到以下结果：

```
> pkg@4.0.0 env /Users/u/path2/pkg
> env

npm_config_save_dev=
npm_config_legacy_bundling=
npm_config_dry_run=
npm_config_viewer=man
TERM_PROGRAM=Apple_Terminal
npm_config_usage=
npm_package_dependencies_connect=^3.6.6
npm_package_description=
npm_package_license=ISC
...
```
以上结果输出了当前进程中所有可用的*环境变量*，除了系统提供的以外，其它的都是哪来的呢？

通过观察其它的环境变量命名特征，发现有两类前缀：

- npm_config_
- npm_package_

对比*npm*的配置项，不难发现以上两种前缀的环境变量均来自于**npm**的配置和**package**的配置，并在*npm-scripts*时被注入。

先区分两个概念：

- **npm的配置**是设定*npm*工具本身的一些属性，可以根据项目、用户或者全局做自定义设置。
- **package配置**是针对特定*package*做的设定，配置项集中在**package.json**中。

## npm的配置

**npm**的配置可以通过命令行、环境变量和`.npmrc`文件三种形式设定。

### 设定方式一：命令行标记

这种方法是在*npm*的命令行加上标记完成配置的设定或者覆盖：

        npm config list --myname=todd --one-two_three_four
        //输出以下内容
        ; cli configs
        myname = "todd"
        one-two_three_four = true

需要说明的是以上配置过程**不会对标记名中的*连字符*、*下划线*进行转换**，之所以强调这个是因为在*npm-scripts*设置过程中有不同，详见[npm-scripts环境变量](#npm-scripts环境变量)。

### 设定方式二：环境变量

根据**npm_config_xxx**命名规则把环境变量设置到配置中。

        npm_config_myname=todd NPM_CONFIG_MYNAME=TODD NPM_CONFIG_ONE=TWO npm config list
        //输出以下内容
        ; environment configs
        myname = "todd"
        one = "TWO"

以上命令行设定了三个环境变量，尽管变量名区分大小写，但是从结果可以看出***npm*从环境变量获取指定变量用做配置时是忽略大小写的**。

### 设定方式三：*&period;npmrc*文件

从四个相关的文件地址读取，但是不一定都存在，按读取优先级排列如下：

- 每个项目的配置`my-project/.npmrc`
- 用户的配置`$HOME/.npmrc`
- 全局配置`$PREFIX/etc/npmrc`
- 内建配置`/path-to-npm/npmrc`

配置文件内容遵循*ini*文件规则，环境变量可以用`${VARIABLE_NAME}`代替，支持数组格式，注释行以`;`或者`#`开头。若项目*pkg*根目录下有`.npmrc`文件，内容如下：

        key1=value
        key2=${HOME}/path/file
        ary[]=av1
        ary[]=av2

执行`npm config list`得到配置如下：

        ; project config /path/to/project/pkg/.npmrc
        ary = ["av1","av2"]
        key1 = "value"
        key2 = "/Users/todd.ma/.npmrc"

**这里需要注意一点，经测试发现设置为数组的*key*，不会出现在*npm-scripts*运行时的环境变量中。**

## package的配置

*package*的配置由*package.json*设定。假设有如下文件内容：

```
{
  "name": "xxx-pkg",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": "pkg-bin.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && echo $PWD, $1"
  },
  "myconf":{
    "obj":{"v":1},
    "jbo": 1000
  },
  "config":{"cfg":100},
  "myary":[3,4,"a"],
  "keywords": [],
  "author": "todd.ma <todd.ma@qunar.com>",
  "license": "ISC",
  "dependencies": {
    "connect": "^3.6.6"
  },
  "devDependencies": {}
}
```
上述文件中的*key*除了*npm*的保留字意外，可以添加自定义的包配置，如上述配置中的**myconf**和**myary**，数据格式自由设定。

## npm-scripts环境变量

除了系统环境变量之外，*npm-scripts*运行时*npm*也会设置自己的环境变量，变量名全部以小写格式。

- 获取*npm*的配置项（无论通过哪种方式设定），加前缀*npm_config_*
- 获取*package.json*的配置项，加前缀*npm_package_*

一些需要注意的点：

- 通过命令行标记的形式设定的*npm*配置项，如果标记名含有“`-`”，在注入环境变量时会转化成“`_`”。

  如命令标记`--one-two_three`将得到环境变量`npm_config_one_two_three=true`
- *npm*配置项中的**数组**没有注入到环境变量中。
- *package.json*中的配置项含有“`-`”，在注入环境变量时也会转化成“`_`”。
- *package.json*中的**config**节点转换成的环境变量，可以通过*npm*的配置设定进行更改。

  如`npm set <package-name>:<key> newValue`，会改变*package.json*中*config*项中*key*对应的环境变量*npm_package_config_key*的值为*newValue*。
