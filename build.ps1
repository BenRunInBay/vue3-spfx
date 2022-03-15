<#
    Webpart build
    @date 2022-02-11b

    Run from PowerShell:
    ./build
#>

Write-Output "Webpart build:`r`n"

npm run build

Remove-Item webpart/src/webparts/assets/fonts -Recurse -Force -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/mock-data -Recurse -Force -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.ico -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.html -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.css -ErrorAction Ignore

Write-Output "`r`n`r`nBUILD DONE."