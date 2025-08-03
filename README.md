# MediChat - AI/ML Healthcare Platform

A comprehensive AI-powered healthcare platform with e-commerce integration, built with Next.js, React, TypeScript, and Google AI.

## 🚀 Features

### AI/ML Components
- **AI Doctor** - Conversational medical AI with symptom analysis
- **Skin Lesion Analyzer** - Computer vision for dermatology
- **Medicine Information** - Drug interaction analysis and recommendations
- **Health Analytics** - Predictive health insights and risk assessment
- **Symptom Analyzer** - ML-powered symptom analysis
- **Medical Summarizer** - Research and topic summarization
- **Prescription Generator** - AI-powered prescription recommendations
- **Mental Health Agent** - Emotional support and mental health companion

### E-commerce Integration
- **Pharmacy** - Complete online pharmacy with shopping cart
- **Payment Processing** - Mock Razorpay integration
- **User Authentication** - Mock user system
- **Order Management** - Order tracking and history

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/agrwalh/NEW.git
cd NEW
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Google AI API Key

**Important:** The AI features require a Google AI API key to work properly.

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

Create a `.env.local` file in the root directory:
```bash
# Google AI API Key
GOOGLE_AI_API_KEY=your_actual_api_key_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## 🔧 Technical Stack

- **Frontend:** Next.js 15.3.3, React 18, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI components
- **AI/ML:** Google AI (Gemini), Genkit
- **Icons:** Lucide React
- **E-commerce:** Mock API routes, shopping cart functionality
- **Authentication:** Mock user system

## 📱 Usage

### AI Doctor
- Click on "AI Doctor" in the sidebar
- Type your symptoms or medical questions
- Receive AI-powered medical guidance and recommendations

### Pharmacy
- Click on "Pharmacy" to access the e-commerce section
- Browse products, add to cart, and complete checkout
- Mock payment processing included

### Other AI Features
- **Symptom Analyzer:** Get symptom analysis and recommendations
- **Skin Lesion Analyzer:** Upload images for dermatology analysis
- **Medicine Info:** Get detailed medicine information and interactions
- **Health Analytics:** View predictive health insights
- **Mental Health:** Chat with AI mental health companion

## ⚠️ Important Notes

1. **Medical Disclaimer:** This is a demonstration platform. All AI responses are for informational purposes only and should not replace professional medical advice.

2. **API Key Required:** The AI features will show fallback responses if the Google AI API key is not configured.

3. **Mock Data:** The e-commerce features use mock data. In production, connect to real databases and payment gateways.

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```
GOOGLE_AI_API_KEY=your_production_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using Next.js, React, and Google AI**
