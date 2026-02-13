# ---- Basic settings ----
export TERM=xterm-256color
export LS_COLORS="di=34:fi=0:ln=36:pi=33:so=35:bd=33;01:cd=33;01:or=31;01:mi=05;37;41:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st=37;44:ex=32"

# ---- Colored prompt with Git branch ----
parse_git_branch() {
    git branch 2>/dev/null | sed -e "/^[^*]/d" -e "s/* \(.*\)/ <\1>/"
}

# Bold colors for branch name
YELLOW="\[\033[01;33m\]"
GREEN="\[\033[01;32m\]"
BLUE="\[\033[01;34m\]"
RESET="\[\033[00m\]"

# PS1: user@host:cwd [branch]$
export PS1="${GREEN}\u@\h${RESET}:${BLUE}\w${YELLOW}\$(parse_git_branch)${RESET}$ "

# ---- Aliases ----
alias ll='ls -la --color=auto'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --decorate'

# ---- Complete history settings ----
HISTCONTROL=ignoredups:erasedups
HISTSIZE=10000
HISTFILESIZE=20000
shopt -s histappend

# ---- Colored ls (for macOS/Linux) ----
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

# ---- Git auto completion (if available) ----
if [ -f /usr/share/bash-completion/completions/git ]; then
    . /usr/share/bash-completion/completions/git
fi
