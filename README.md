# 🏥 AI Public Health Chatbot

An AI-driven public health awareness platform that provides real-time disease outbreak alerts, regional health advisories, and expert guidance through an intelligent chatbot.

## 📋 Features

- **Real-time Disease Alerts**: Get instant notifications about disease outbreaks in your area
- **Health Chatbot**: Ask questions about health, diseases, and prevention strategies
- **Regional Health Advisories**: Search health data by pincode
- **Admin Dashboard**: Manage and upload disease data via CSV
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Medical Disclaimers**: Clear warnings about data accuracy and recommendations to consult doctors

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI Components
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Supabase account (for backend services)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Viveksanap18/AI-HealthCare_Minor.git
cd AI-HealthCare_Minor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your [Supabase project settings](https://supabase.com/dashboard)

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 📱 Project Structure

```
src/
├── pages/           # Main application pages
│   ├── Index.tsx    # Home page with disease alerts
│   ├── Chatbot.tsx  # AI Health Chatbot
│   ├── Admin.tsx    # Admin panel for data management
│   └── Auth.tsx     # Authentication page
├── components/      # Reusable React components
│   ├── DiseaseAlertCard.tsx
│   ├── Header.tsx
│   └── ui/         # Shadcn UI components
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client setup
└── lib/            # Utility functions
```

## 🔗 Deployment Options

### Option 1: Deploy on Vercel (Recommended)

1. Push code to GitHub (already done ✓)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import repository
4. Select your GitHub repository
5. Add environment variables in project settings
6. Click "Deploy"

**Live URL**: https://your-project.vercel.app

### Option 2: Deploy on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Click "Deploy"

### Option 3: Deploy on GitHub Pages

```bash
# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Run
npm run deploy
```

## 📊 Database Setup (Supabase)

1. Create a new Supabase project
2. Run migrations from `supabase/migrations/` folder
3. Deploy edge functions from `supabase/functions/` folder

## 🔐 Authentication

- Users can sign up and log in
- Admin users can manage disease data
- Admin status is controlled via Supabase user metadata

## 📝 Usage

### For Users:
1. Enter your pincode to see local disease alerts
2. Search by pincode to view health advisories
3. Chat with the AI chatbot for health-related questions

### For Admins:
1. Log in with admin credentials
2. Upload CSV files with disease data
3. Manage and delete records
4. CSV Format: `pincode, disease_name, cases, date, advice`

## 🚨 Important Notes

⚠️ **Medical Disclaimer**: This application provides information based on available data. We are not 100% accurate. For accurate medical advice, please consult a doctor.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

**Vivek Sanap**  
GitHub: [@Viveksanap18](https://github.com/Viveksanap18)

## 📞 Support

For issues and feature requests, please open an issue on [GitHub Issues](https://github.com/Viveksanap18/AI-HealthCare_Minor/issues)

## 🔗 Project Link

**Repository**: https://github.com/Viveksanap18/AI-HealthCare_Minor


