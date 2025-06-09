# KISS Cosmic Signature Website - README

## Project Overview
This project is a cosmic astrology report website built following the KISS-CELLENCE™ philosophy of divine simplicity. The website allows users to enter their birth details and receive a beautifully designed cosmic signature report.

## Features
- Single page application with smooth scroll sections
- Birth data input form with date, time, and location fields
- Real astronomy calculations using the astronomy-engine library
- Beautiful cosmic report generation with unique insights
- Supabase integration for content storage
- Responsive design with cosmic aesthetic

## Tech Stack
- React for the frontend
- Tailwind CSS for styling (via utility classes)
- astronomy-engine for celestial calculations
- Supabase for content storage

## Project Structure
```
/cosmic-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BirthDataForm.jsx
│   │   ├── CosmicReport.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   └── ReportGenerator.jsx
│   ├── lib/
│   │   ├── astroCalculator.js
│   │   └── supabaseClient.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or pnpm

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   pnpm install
   ```

### Configuration
1. Create a Supabase project at https://supabase.com
2. Update the Supabase URL and key in `src/lib/supabaseClient.js`
3. Create the following tables in your Supabase database:
   - `cosmic_terminology` (id, term, description)
   - `report_templates` (id, section, template)
   - `cosmic_reports` (id, birth_date, birth_time, latitude, longitude, sun_sign, moon_sign, ascendant, report_content, created_at)

### Development
Run the development server:
```
pnpm run dev
```

### Deployment
1. Build the project:
   ```
   pnpm run build
   ```
2. Deploy to Vercel or Netlify:
   - Connect your GitHub repository to Vercel/Netlify
   - Configure the build settings (build command: `pnpm run build`, output directory: `dist`)
   - Click Deploy

## Implementation Notes
- The astronomy calculations are performed using the astronomy-engine library
- The sacred geometry patterns are generated based on birth chart data
- The cosmic terminology and report templates are stored in Supabase
- The application follows the KISS-CELLENCE™ philosophy of shipping quickly with divine simplicity

## Future Enhancements (v2)
- User accounts for saving reports
- PDF export functionality
- More detailed astronomical calculations
- Additional report types
- Social sharing features

---

Remember: "Perfect is the enemy of tonight." This cosmic signature app exists, which beats a perfect one that doesn't. 🚀✨
