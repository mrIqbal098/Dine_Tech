# Deployment Guide: Backend + Frontend

This guide shows how to deploy the Node.js + TypeORM backend to a live server and configure the Next.js frontend to connect to it.

## 1. Deploy Backend to a Live Server

### Option A: Deploy to Heroku (Free / Paid)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create a Heroku App**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   # Database connection (use Heroku PostgreSQL or external MySQL)
   heroku config:set DB_HOST=your-db-host
   heroku config:set DB_PORT=3306
   heroku config:set DB_USER=your-db-user
   heroku config:set DB_PASSWORD=your-db-password
   heroku config:set DB_NAME=your-db-name
   heroku config:set NEXT_PUBLIC_SITE_URL=https://your-app-name.herokuapp.com
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run Seed Script** (optional, if needed)
   ```bash
   heroku run "npm run seed"
   ```

### Option B: Deploy to DigitalOcean / AWS / Render / Railway

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create App on Cloud Platform**
   - **Render**: Connect GitHub repo, set build/start commands, add env vars, deploy
   - **Railway**: Connect GitHub, Railway auto-detects Node.js, set env vars, deploy
   - **DigitalOcean App Platform**: Connect GitHub, configure Node.js, set env vars, deploy
   - **AWS Elastic Beanstalk**: Deploy using `eb create` and configure env vars

3. **Set Environment Variables** (via platform's dashboard)
   ```
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   NEXT_PUBLIC_SITE_URL=https://your-backend-domain.com
   NODE_ENV=production
   ```

4. **Start Command** (usually auto-detected)
   ```bash
   npm run dev
   # or
   npm start
   ```

### Option C: Deploy to VPS (DigitalOcean Droplet, Linode, Vultr, etc.)

1. **SSH into your VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Node.js & npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm --version
   ```

3. **Install MySQL** (if not already set up)
   ```bash
   sudo apt-get install mysql-server
   sudo mysql_secure_installation
   ```

4. **Clone Your Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/restaurant-3d-menu-web-app.git
   cd restaurant-3d-menu-web-app/backend
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Create `.env` file on VPS**
   ```bash
   cat > .env << EOF
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=appuser
   DB_PASSWORD=your-secure-password
   DB_NAME=restaurant_db
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NODE_ENV=production
   PORT=4000
   EOF
   ```

7. **Set Up MySQL Database**
   ```bash
   mysql -u root -p
   ```
   Then run:
   ```sql
   CREATE DATABASE restaurant_db;
   CREATE USER 'appuser'@'127.0.0.1' IDENTIFIED BY 'your-secure-password';
   GRANT ALL PRIVILEGES ON restaurant_db.* TO 'appuser'@'127.0.0.1';
   FLUSH PRIVILEGES;
   EXIT;
   ```

8. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

9. **Start Backend with PM2**
   ```bash
   cd /var/www/restaurant-3d-menu-web-app/backend
   pm2 start npm --name "backend" -- run dev
   pm2 startup
   pm2 save
   ```

10. **Install & Configure Nginx (Reverse Proxy)**
    ```bash
    sudo apt-get install nginx
    sudo nano /etc/nginx/sites-available/default
    ```
    Replace the file content with:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

11. **Enable HTTPS with Let's Encrypt**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

12. **Restart Nginx**
    ```bash
    sudo systemctl restart nginx
    ```

---

## 2. Update Frontend to Point to Live Backend

Once your backend is live at `https://your-backend-domain.com`, update the frontend:

### Option A: Environment Variable

1. **Create `.env.production` in frontend root**
   ```bash
   cat > .env.production << EOF
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   EOF
   ```

2. **Or set it in your hosting platform** (Vercel, Netlify, etc.)
   - Go to your app settings → Environment Variables
   - Set: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

### Option B: Deploy Frontend to Vercel (Recommended for Next.js)

1. **Connect Your GitHub Repo to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

3. **Deploy**
   - Vercel auto-deploys on every push to main branch

### Option C: Deploy Frontend to Netlify

1. **Build the Next.js App**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Set Environment Variables**
   - Netlify dashboard → Site settings → Build & deploy → Environment
   - Add: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`

### Option D: Deploy Frontend to VPS (Same as Backend)

1. **On VPS, build the Next.js app**
   ```bash
   cd /var/www/restaurant-3d-menu-web-app
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com npm run build
   ```

2. **Start with PM2**
   ```bash
   pm2 start npm --name "frontend" -- start
   pm2 save
   ```

3. **Configure Nginx for Frontend**
   ```nginx
   server {
       listen 80;
       server_name your-frontend-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 3. Test the Live Setup

1. **Check Backend is Running**
   ```bash
   curl https://your-backend-domain.com/api/auth/me
   # Should return 401 (not authenticated) or user object
   ```

2. **Check Frontend Can Reach Backend**
   - Open browser DevTools → Network tab
   - Try to login
   - Verify requests go to `https://your-backend-domain.com/api/auth/login`
   - Check for CORS errors

3. **Verify CORS is Configured**
   - The backend `allowedOrigins` should include your frontend domain:
   ```typescript
   const allowedOrigins = [
     'https://your-frontend-domain.com',
     'http://localhost:3001', // for local dev
   ];
   ```

---

## 4. Troubleshooting

### CORS Error on Production
- Update `backend/src/index.ts` `allowedOrigins` array with your frontend domain
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in backend env vars

### Backend Not Found
- Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend env
- Check backend is actually running: `curl https://your-backend-domain.com/api/restaurants`

### Database Connection Error
- Verify DB credentials in `.env`
- Ensure MySQL is running and accessible from backend server
- Check firewall rules allow connection to DB port (3306)

### Cookie Not Being Set
- Ensure backend returns `Set-Cookie` header with `HttpOnly` flag
- Verify frontend uses `credentials: 'include'` in fetch calls

---

## 5. Quick Summary

| Component | Local | Production |
|-----------|-------|-----------|
| Backend | `http://localhost:4000` | `https://your-backend-domain.com` |
| Frontend | `http://localhost:3001` | `https://your-frontend-domain.com` |
| Database | Local MySQL | Cloud MySQL or VPS MySQL |
| Environment Var | `NEXT_PUBLIC_API_URL=http://localhost:4000` | `NEXT_PUBLIC_API_URL=https://your-backend-domain.com` |

---

## Next Steps

1. Choose a hosting platform for backend (Heroku, Render, DigitalOcean, etc.)
2. Deploy backend and get the live URL
3. Update `NEXT_PUBLIC_API_URL` in frontend to the live backend URL
4. Deploy frontend (Vercel, Netlify, or same VPS as backend)
5. Test login and API calls work end-to-end
