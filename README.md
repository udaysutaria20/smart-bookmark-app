# Smart Bookmark App

A simple bookmark manager built with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS. Users can log in with Google, add/delete bookmarks, and see updates in real-time.

## Live Demo

[Smart Bookmark App Live](https://smart-bookmark-app-tau-eight.vercel.app)

## GitHub Repo

[GitHub Repository](https://github.com/udaysutaria20/smart-bookmark-app)

## Problems I Ran Into and How I Solved Them

1. **Git not recognized in VS Code**
   - Error: `git : The term 'git' is not recognized`
   - Solution: Installed Git for Windows, added it to PATH, restarted VS Code.

2. **Module not found: '@/lib/supabase'**
   - Error during build: Next.js couldn’t find supabase client.
   - Solution: Corrected import paths to relative path (`../../lib/supabase`) and/or created proper `jsconfig.json` with alias.

3. **Vercel build failed**
   - Error: `npm run build exited with 1`
   - Solution: Added Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel dashboard.

4. **Deleting Git repo to start fresh**
   - Issue: Made mistakes in Git setup.
   - Solution: Removed `.git` folder with `Remove-Item -Recurse -Force .git` in PowerShell, reinitialized Git, and pushed to GitHub.

## Features

- Google login (OAuth only)  
- Add, delete bookmarks  
- Bookmarks are private per user  
- Real-time updates across tabs  
- Tailwind CSS styling  
- Deployed on Vercel

