echo "Running build-version.sh"
pwd
ls -la

node build-version.js

if [ $? -ne 0 ]; then
    echo "Error: build-version.js failed to execute."
    exit 1
fi

printf "\n\n"

if [ ! -f src/build-version.json ]; then
    echo "Error: src/build-version.json not found."
    exit 1
fi

cat src/build-version.json
printf "\n\n"
