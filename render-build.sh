set -o errexit


npm install
npm run build
npm run db:generate
npm run db:migrate