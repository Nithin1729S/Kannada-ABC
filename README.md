# Setup and Navigation

## Environmental Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
MONGODB_URI=your_mongodb_uri            # MongoDB connection string
GOOGLE_CLIENT_ID=your_google_client_id  # OAuth client ID from Google Cloud Console
GOOGLE_CLIENT_SECRET=your_google_client_secret  # OAuth client secret
NEXTAUTH_URL=http://localhost:3000      # Your application URL
NEXTAUTH_SECRET=random_string           # Random string for NextAuth session
```

## Getting Started
To run the frontend application:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

To run the fastapi backend server:
```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```

## Function

MongoDB - For User and his Progress related data \
FastAPI Server - to serve the cnn model
 
## Available Routes
| Route | Description |
|-------|-------------|
| `/learn` | Letter Tracing |
| `/practice` | Blank Canvas |
| `/profile` | View Learning Progress |
| `/wiki` | Random Animal Thing |
| `/auth` | Authentication |

