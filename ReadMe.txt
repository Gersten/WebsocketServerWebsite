install in termux "pkg install git"

=> git clone "github_project_link"
=> cd "to_folder_project"
=> git pull   (to update it)


//restart prject and update
=> git pull & pm2 restart index.js







127|a02:/ $ settings get system screen_off_timeout
1800000
a02:/ $ settings put system screen_off_timeout 2147483647
a02:/ $ settings get system screen_off_timeout
2147483647






settings.json maybe we also need to give chmod777 to it in termux