---
title: Linux 常用操作技巧
date: 2026-06-02
tags: [教程, Linux]
cover: /blog/covers/linux-tips.svg
---

Linux 是程序员绕不开的操作系统。日常开发中积累了一些实用技巧，整理分享。

<!-- more -->

## 文件与目录

### 快速跳转

```bash
cd -          # 回到上一个目录
cd ~          # 回到 home 目录
pushd /path   # 跳转并压栈，之后用 popd 弹回来
```

### 查找文件

```bash
find . -name "*.ts"              # 按名称找
find . -type f -size +10M        # 找大于 10M 的文件
find . -name "node_modules" -type d -prune -o -name "*.vue" -print  # 跳过 node_modules
```

### 查找内容

```bash
grep -r "关键字" .               # 递归搜索当前目录
grep -rl "关键字" .              # 只列出文件名
grep -rn "关键字" .              # 带行号
grep -r --include="*.ts" "关键字" .  # 只搜 .ts 文件
```

### 目录大小

```bash
du -sh *          # 当前目录下每个文件/文件夹的大小
du -h --max-depth=1  # 一层深度的空间占用
ncdu              # 交互式磁盘空间分析（需安装）
```

## 文本处理

### 三剑客速查

```bash
# grep —— 过滤
grep "error" app.log                     # 找包含 error 的行
grep -v "debug" app.log                  # 排除 debug 行
grep -A 3 -B 2 "error" app.log           # 匹配行的前后各几行

# awk —— 列处理
awk '{print $1, $3}' file.txt            # 打印第 1、3 列
awk -F':' '{print $1}' /etc/passwd      # 指定分隔符
awk '$3 > 100 {print $1}' file.txt       # 第 3 列 > 100 的行

# sed —— 流编辑器
sed 's/old/new/g' file.txt               # 替换
sed -i 's/old/new/g' file.txt            # 原地替换
sed '3,5d' file.txt                      # 删除第 3-5 行
```

### 管道组合

```bash
# 找占用最大的 5 个文件
du -ah /dir | sort -rh | head -5

# 统计 IP 访问量
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 统计每种文件的数目
find . -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn
```

## 进程管理

```bash
ps aux | grep node         # 找进程
pgrep -f node              # 直接拿 PID
kill -9 <PID>              # 强制杀掉
pkill -f "node server"     # 按名字杀

htop                       # 比 top 更好看的进程管理器
```

### 后台运行

```bash
nohup ./script.sh &        # 关终端也不断
nohup ./script.sh > out.log 2>&1 &   # 输出写日志
disown                     # 把当前后台任务脱离终端

# screen / tmux 更专业
tmux new -s dev            # 新建会话
tmux attach -t dev         # 重连
```

## 权限速查

```bash
chmod +x script.sh         # 加执行权限
chmod 755 file             # rwxr-xr-x
chown user:group file      # 改文件所有者

# 数字含义记忆：r=4 w=2 x=1
# 644 = rw-r--r--（文件）
# 755 = rwxr-xr-x（目录/脚本）
# 600 = rw-------（私钥）
```

## 网络调试

```bash
curl -I https://example.com           # 只看响应头
curl -X POST -d '{"k":"v"}' url       # POST JSON
curl -o file.zip url                   # 下载文件

nc -zv host port                       # 测端口通不通
ss -tlnp                               # 看监听端口
lsof -i :3000                          # 看谁占用了 3000 端口
```

## SSH 技巧

```bash
# 免密登录
ssh-keygen -t ed25519 -C "你的邮箱"
ssh-copy-id user@host

# 配置文件 ~/.ssh/config
Host myserver
    HostName 1.2.3.4
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# 然后直接
ssh myserver
```

### 端口转发

```bash
# 本地端口映射到远程
ssh -L 8080:localhost:3000 myserver
# 访问本机 8080 = 远程 3000

# 反向隧道（远程能访问你的本地服务）
ssh -R 9090:localhost:3000 myserver
```

## 小技巧

### 历史命令

```bash
Ctrl+R          # 搜索历史命令，多按几次切换
!!              # 重复上一条
!$              # 上条命令的最后一个参数
!gh             # 执行最近一条 gh 开头的命令
```

### 快速清空文件

```bash
> file.log      # 清空但保留 inode（程序还在写日志时用）
truncate -s 0 file.log   # 同上
```

### 解压命令备忘

```bash
tar -xzf file.tar.gz      # .tar.gz
tar -xjf file.tar.bz2     # .tar.bz2
unzip file.zip             # .zip
unrar x file.rar           # .rar
```

### 别名推荐

在 `~/.bashrc` 或 `~/.zshrc` 里加：

```bash
alias ll='ls -alFh'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias g='git'
alias ip='ip -color'
alias free='free -h'
alias df='df -h'
```

## 常用工具推荐

| 工具 | 用途 | 一句话 |
|------|------|--------|
| `ripgrep` (rg) | 搜索 | 比 grep 快，默认递归、忽略 .gitignore |
| `fd` | 查找文件 | 比 find 快，语法更友好 |
| `bat` | 查看文件 | cat 的替代品，带语法高亮 |
| `jq` | JSON 处理 | 命令行里的 JSON 神器 |
| `fzf` | 模糊搜索 | 交互式模糊匹配，搭配什么都好用 |
| `zoxide` (z) | 目录跳转 | 记录常用目录，智能跳转 |
| `tldr` | 命令帮助 | 比 man 简洁的示例文档 |

---

> 工欲善其事，必先利其器。掌握这些技巧能让你在终端里如鱼得水 🐟
