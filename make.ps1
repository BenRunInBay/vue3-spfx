<#
    Webpart build, bundle and ship
    This will build the Vue app into the assets folder within the webpart, then update the webpart to reference it for rendering.

    Run from PowerShell in the root app folder (not the webpart sub-folder)
    ./make
#>

function Log {
    param (
        $Message
    )
    Write-Host $Message -ForegroundColor yellow -BackgroundColor black
    Write-Host " "
}

Log "Webpart build, bundle and ship:"
Log "REMINDER: update version in package.json before running this script because that will become the version of the webpart package."

Log "Building webpart..."
npm run build
Remove-Item webpart/src/webparts/assets/fonts -Recurse -Force -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/mock-data -Recurse -Force -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.ico -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.html -ErrorAction Ignore
Remove-Item webpart/src/webparts/assets/*.css -ErrorAction Ignore

Log "Bundling assets..."
$programPath = "node_scripts\bundle-webpart-assets.js"
$cmd = "node"
$params = @($programPath)
& $cmd $params

Log "Packaging for shipping to SharePoint..."
cd webpart
gulp clean
gulp bundle --ship
gulp package-solution --ship
cd ..

Log "DONE."
Log "Webpart package for uploading to App Catalog is in: webpart/sharepoint/solution/"