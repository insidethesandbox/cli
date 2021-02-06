OUT="/usr/local/bin/isb.mjs"
curl https://raw.githubusercontent.com/insidethesandbox/cli/main/dist/isb.mjs -o "$OUT"
cat << EOF > /usr/local/bin/isb
node /usr/local/bin/isb.mjs "\$@"
EOF
chmod +x /usr/local/bin/isb
chmod +x /usr/local/bin/isb.mjs
