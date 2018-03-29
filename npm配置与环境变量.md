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

对比*npm*的配置项发现，原来以上两种前缀的环境变量均来自于**npm**的配置和**package**的配置，并在*run-script*时被注入。

## npm的配置

**npm**的配置可以通过命令行、环境变量和`.npmrc`文件三种形式设定。

### 设定方式一：命令行标记
这种方法是在*npm*的命令行加上自定义标记完成配置的设定：

        npm config list --name=jack
        //输出以下内容
        ; cli configs
        myname = "todd"

### 设定方式二：环境变量
根据**npm_config_xxx**命名规则把环境变量设置到配置中。

        npm_config_myjoy=tank npm config list
        //输出以下内容
        ; environment configs
        myjoy = "tank"

### 设定方式三：*&period;npmrc*文件
从四个相关的文件地址读取，但是不一定都存在，按读取优先级顺序排列如下：
- 每个项目的配置`my-project/.npmrc`
- 用户的配置`$HOME/.npmrc`
- 全局配置`$PREFIX/etc/npmrc`
- 内建配置`/path-to-npm/npmrc`

配置文件内容遵循*ini*文件规则，环境变量可以用`${VARIABLE_NAME}`代替，支持数组格式，注释行以`;`或者`#`开头。

        key1=value
        key2=${HOME}/path/file
        ary[]=av1
        ary[]=av2
以上设定得到配置如下：

        ary = ["av1","av2"]
        key1 = "value"
        key2 = "/Users/login-name/path/file"

## package的配置
*package*的配置由*package.json*设定。
