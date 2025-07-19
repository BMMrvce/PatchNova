# 🛡️ PatchNova

**A modern, intelligent vulnerability assessment and patch management application built with React**

PatchNova is a comprehensive cybersecurity platform that helps organizations identify, analyze, and manage security vulnerabilities through automated scanning, AI-powered analysis, and intuitive reporting capabilities.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### Core Functionality
- 🔍 **Automated Vulnerability Scanning** - Upload and analyze network scan files (XML format)
- 🤖 **AI-Powered Analysis** - OpenAI integration for intelligent vulnerability assessment
- 📊 **Interactive Dashboard** - Real-time metrics and risk distribution visualization
- 📋 **Comprehensive Reporting** - Generate detailed security reports with actionable insights
- 💬 **AI Chat Assistant** - Natural language queries about security findings
- 🔐 **Secure Authentication** - Supabase-powered user management and authentication

### Technical Features
- ⚡ **Lightning-Fast Performance** - Built with Vite for optimal development and build speed
- 🎨 **Modern UI/UX** - Tailwind CSS with responsive design and dark mode support
- 📱 **Mobile-First Design** - Fully responsive across all device sizes
- 🔄 **Real-time Updates** - Live data synchronization with Supabase backend
- 🛡️ **Error Boundary Protection** - Graceful error handling and recovery
- 📈 **Data Visualization** - Interactive charts and graphs for security metrics

## 📋 Prerequisites

Before running PatchNova, ensure you have:

- **Node.js** (v16.x or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** - For AI-powered vulnerability analysis
- **Supabase Account** - For backend services and authentication

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/BMMrvce/PatchNova.git
cd PatchNova
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Start Development Server
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
PatchNova/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── manifest.json
│   └── assets/
│       └── images/
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ...
│   │   ├── AppIcon.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ScrollToTop.jsx
│   ├── contexts/               # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/                  # Page components
│   │   ├── dashboard/          # Dashboard page & components
│   │   ├── login/              # Authentication pages
│   │   ├── upload-scan/        # File upload & scanning
│   │   ├── vulnerabilities/    # Vulnerability management
│   │   ├── ai-chat-analysis/   # AI chat interface
│   │   ├── reports/            # Report generation
│   │   ├── logs/               # System logs
│   │   └── NotFound.jsx
│   ├── services/               # API and external services
│   │   └── openaiService.js    # OpenAI integration
│   ├── utils/                  # Utility functions
│   │   ├── authService.js
│   │   ├── fileUploadService.js
│   │   ├── supabase.js
│   │   └── cn.js
│   ├── styles/                 # Global styles
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── App.jsx                 # Main application component
│   ├── Routes.jsx              # Application routing
│   └── index.jsx               # Application entry point
├── supabase/                   # Supabase configuration
│   ├── superbaseClient.js
│   └── migrations/
├── build/                      # Production build output
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.mjs             # Vite configuration
└── README.md                   # Project documentation
```

## 🧩 Core Components

### Dashboard
- **MetricsCard** - Key security metrics display
- **PatchStatusChart** - Visual patch status tracking
- **RiskDistributionChart** - Risk level distribution
- **ActivityFeed** - Recent security events
- **QuickActionsPanel** - Common administrative actions

### Vulnerability Management
- **VulnerabilityTable** - Sortable, filterable vulnerability list
- **VulnerabilityDetails** - Detailed vulnerability information
- **FilterSidebar** - Advanced filtering options
- **RiskMetrics** - Risk assessment indicators

### AI Chat Analysis
- **MessageBubble** - Chat message components
- **SuggestedQueries** - Pre-defined security questions
- **ChatInput** - Natural language input interface
- **EmptyState** - Onboarding and help interface

### File Upload & Scanning
- **FileUploadZone** - Drag & drop file interface
- **ProcessingStatus** - Real-time scan progress
- **FileDetails** - Uploaded file information
- **SampleDownload** - Example file downloads

## 🔧 Configuration

### Tailwind CSS
The project uses an extensive Tailwind configuration with:
- Custom color schemes for security themes
- Extended spacing and typography scales
- Custom animations and transitions
- Responsive breakpoint customizations

### Vite Configuration
Optimized build configuration with:
- Fast HMR (Hot Module Replacement)
- Code splitting and tree shaking
- Environment variable handling
- Production optimizations

## 🚀 Available Scripts

```bash
# Development
npm start          # Start development server
npm run dev        # Alternative development command

# Building
npm run build      # Create production build
npm run preview    # Preview production build

# Testing
npm test           # Run test suite
npm run test:watch # Run tests in watch mode

# Linting & Formatting
npm run lint       # Check code quality
npm run format     # Format code with Prettier

# Deployment
npm run deploy     # Deploy to GitHub Pages
```

## 🌐 API Integration

### OpenAI Service
PatchNova integrates with OpenAI for:
- Vulnerability analysis and prioritization
- Security recommendations generation
- Natural language security queries
- Risk assessment automation

### Supabase Backend
- User authentication and authorization
- Real-time data synchronization
- File storage for scan results
- Audit logging and user management

## 📊 Data Flow

1. **File Upload** → XML scan files uploaded via drag & drop
2. **Parsing** → Files parsed and validated
3. **AI Analysis** → OpenAI processes vulnerability data
4. **Storage** → Results stored in Supabase
5. **Visualization** → Interactive dashboards and charts
6. **Reporting** → Automated report generation
7. **Chat Interface** → Natural language queries about findings

## 🔐 Security Features

- **Authentication** - Secure user login/logout with Supabase Auth
- **Authorization** - Role-based access control
- **Data Encryption** - All API keys and sensitive data encrypted
- **Input Validation** - Comprehensive file and input validation
- **Error Handling** - Secure error boundaries and logging
- **HTTPS Enforcement** - Secure communication protocols

## 📱 Responsive Design

PatchNova is fully responsive with breakpoints:
- **Mobile** - 320px - 768px
- **Tablet** - 768px - 1024px  
- **Desktop** - 1024px+
- **Large Desktop** - 1440px+

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `build/` directory to your hosting provider
3. Configure environment variables on your hosting platform
4. Ensure HTTPS is enabled

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project includes:
- Unit tests for components
- Integration tests for services
- End-to-end testing setup
- API mocking for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@patchnova.com or join our [Discord community](https://discord.gg/patchnova).

## 🔗 Links

- **Live Demo**: [https://bmmrvce.github.io/PatchNova](https://bmmrvce.github.io/PatchNova)
- **Repository**: [https://github.com/BMMrvce/PatchNova](https://github.com/BMMrvce/PatchNova)
- **Documentation**: [Wiki](https://github.com/BMMrvce/PatchNova/wiki)
- **Issues**: [Bug Reports](https://github.com/BMMrvce/PatchNova/issues)

---

**Built with ❤️ by the PatchNova Team**

*Securing the digital world, one vulnerability at a time.*
