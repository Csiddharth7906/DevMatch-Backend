## DevMatch APIs

#  authRouter
  
POST /signup
POST /login
POST /logout

#  profileRouter

GET /profile/view
PATCH /profile/edit
PATCH /profile/password // Forgot password API

#  connectionRequestRouter

POST /request/send/:status/:userId
POST /request/review/:status/:requestId

# userRouter

GET /user/requests/received
GET /user/connections
GET /user/feed - Gets you the profiles of other users on platform
GET /user/profile/:userId - Get detailed profile of a specific user with GitHub repos
POST /user/sync-github - Sync GitHub repositories for logged in user

# chatRouter

GET /chat/:targetUserId - Get or create chat with target user

Status: ignored, interested, accepted, rejected

# New Profile Features:
- GitHub integration with repository sync
- Profile privacy controls (public/private)
- LinkedIn and portfolio URL support
- Experience level tracking
- Location information
- Enhanced profile viewing with connection status