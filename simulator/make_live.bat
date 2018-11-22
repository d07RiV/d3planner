@echo off
setlocal ENABLEDELAYEDEXPANSION
for %%f in (ptr_*.js) do (
  set tmp=%%f
  git rm !tmp:~4!
  git mv %%f !tmp:~4!
  echo %%f
)