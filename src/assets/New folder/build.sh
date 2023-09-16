# open repo with dev.pem 
cd private

# create ssh connection to server

 << EOF

# cd to convin-frontend folder
cd convin-frontend/

# fetch latest code form repo
git pull

# create build
npm run build
EOF