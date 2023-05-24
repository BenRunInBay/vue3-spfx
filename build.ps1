<#
    Webpart build

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

Remove-Item webpart\src\webparts\assets\appcode\*.d.ts -ErrorAction Ignore
$indexjsname = (Get-ChildItem -Path "webpart\src\webparts\assets\appcode" *.js | Select-Object BaseName).BaseName
New-Item -Path "webpart\src\webparts\assets\appcode" -Name "$indexjsname.d.ts" -Value "export = '$indexjsname'; export declare function renderVue(appID);"

Write-Output "`r`n`r`nBUILD DONE."