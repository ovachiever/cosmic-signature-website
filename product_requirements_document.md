# Product Requirements Document (PRD)

## 1. Purpose & Success Metrics

**Purpose:**  
youarethestar.tech is a next-generation astrological platform that harnesses the power of advanced ephemeris calculations, large language models, and modern web technologies to deliver personalized cosmic insights. Our mission is to make astrology and all esoteric and ancient (and modern!) wisdoms accessible, actionable, and habit-forming through plain-English interpretations, personalized daily guidance, and tiered depth options that grow with the user's interest level.

**Success Metrics:**  
- **Hook Metric:** Daily "Star Weather" email open-rate ≥ 45% in first 30 days
- **North-Star Metric:** Paid conversion of 10% of monthly active users within six months
- **Secondary Metrics:** 
  - Free-to-paid upgrade rate of initial blueprint report (≥ 3%)
  - Retention rate after 60 days (≥ 40%)
  - Referral/share rate (≥ 15% of users sharing their reports)

---

## 2. Target Personas & Jobs-to-Be-Done

### Personas

**Cosmic Curious (35%)**
- First-time or casual astrology consumer
- Primarily interested in fun, accessible insights about themselves
- Prefers plain English over technical astrological terminology
- *"I want to know what my birth chart says about me without getting lost in technical jargon."*

**Self-Development Seeker (40%)**
- Uses astrology as one of several personal growth tools
- Values practical guidance for daily decision-making
- Enjoys connecting cosmic patterns to their life experiences
- *"I want daily guidance that helps me align my actions with cosmic energies."*

**Astrology Enthusiast (20%)**
- Familiar with basic astrological concepts
- Seeks deeper technical insights and sophisticated interpretations
- Interested in aspects, transits, and advanced chart features
- *"I want to deepen my astrological knowledge and get insights beyond the basics."*

**Professional/Facilitator (5%, future focus)**
- Astrologers, coaches, or wellness professionals
- Need white-label reports and client management tools
- Value integration with their existing practice
- *"I want to enhance my professional offerings with accurate, beautiful astrological insights."*

### Jobs-to-Be-Done

**Functional Jobs:**
- Generate an accurate birth chart with intuitive visualizations
- Translate complex astrological data into accessible insights
- Deliver personalized daily guidance based on planetary movements
- Archive and retrieve historical reports and predictions

**Emotional Jobs:**
- Feel a sense of cosmic connection and meaningful patterns
- Gain validation for personality traits and life experiences
- Experience moments of insight and self-discovery
- Build confidence in navigating life's complexities

**Social Jobs:**
- Share personally meaningful cosmic insights with friends
- Initiate conversations about personality and compatibility
- Showcase unique aspects of identity through astrological lens
- Connect with others through shared cosmic experiences

---

## 3. Scope — MVP+ Functional Requirements

### Core Experience

**Free Initial Cosmic Blueprint:**
- Multi-step birth data collection (name, date, time, location with geocoding)
- Swiss Ephemeris-powered accurate chart calculation
- Plain English interpretation of Sun, Moon, Ascendant, and key aspects
- Beautiful, shareable visualization of cosmic signature
- Statistical rarity calculation of the user's chart configuration

**Personalized Daily "Astro-Weather":**
- Opt-in daily email delivery
- Personalized transit interpretations based on natal chart
- Today's cosmic climate and how it impacts the user specifically
- Actionable insights for optimal alignment with the day's energies
- One-click upsell to deeper insights ("Mini Deep-Dive")

**Monetization Tiers:**
- **$3 One-time "Astro Lingo" Upgrade:** Enhanced technical terminology and deeper chart insights
- **$6 "Mini Deep-Dive" Reports:** Focused analysis on specific life areas or transit events
- **$12/mo "Explorer Tier":** 4 standard reports/month, report archive access
- **$29/mo "Navigator Tier":** Unlimited standard reports, 2 premium analyses/month, real-time alerts

### Technical Requirements

**Frontend:**
- Next.js 14 on Vercel
- Responsive, PWA-ready design
- Multi-step user onboarding
- Interactive chart visualization
- Account management dashboard

**Backend:**
- Flask API with Swiss Ephemeris integration
- Timezone and location handling
- LLM integration (OpenAI, Claude, Gemini) for report generation
- Caching layer for performance optimization

**Data & Auth:**
- Supabase PostgreSQL + pgvector
- JWT-based authentication
- Ephemeris data management
- Report template system
- User preference storage

**Integrations:**
- Email delivery (Resend/Mailersend)
- Payment processing (Stripe)
- Analytics tracking
- Social sharing

---

## 4. Out-of-Scope (post-MVP)

The following features are explicitly planned for future phases and not part of the initial MVP+ release:

**Technical Exclusions:**
- Deep security hardening beyond standard practices
- Comprehensive CI/CD pipeline and test automation
- Multi-language/localization support
- Native mobile applications

**Feature Exclusions:**
- Relationship compatibility analysis
- Predictive horoscope beyond 7 days
- Alternate house systems or chart types (heliocentric, draconic, etc.)
- Integration with Human Design, Gene Keys, or other systems
- Community forums or social features
- Facilitator License tier (client portals, white-label)

**Infrastructure Exclusions:**
- Enterprise-grade scaling solutions
- Geographic redundancy
- Webhook/API access for third-party integrations
- Custom PDF report generation
- Push notification infrastructure

These items are documented to maintain focus on core MVP+ deliverables while acknowledging the future roadmap.

---

## 5. User Flows (bullet-level, per funnel stage)

### Acquisition
- User discovers site through search, social media, or word-of-mouth
- Views compelling homepage showcasing cosmic insights
- Clicks "Get My Free Cosmic Blueprint" CTA

### Onboarding
- Step 1: Enters name and birth date
- Step 2: Provides birth time (with "unknown time" option)
- Step 3: Enters birth location (smart geocoding with popular city selection)
- Step 4: Reviews and confirms data
- System calculates chart using Swiss Ephemeris

### Activation
- Views initial cosmic blueprint in plain English
- Explores interactive visualization of planetary positions
- Receives statistical rarity of their cosmic signature
- Is prompted to save/share report (account creation trigger)
- Sees "$3 Upgrade to Astro Lingo" option

### Engagement
- Opts in to daily "Astro-Weather" email
- Receives first personalized daily email
- Clicks through to view expanded daily guidance
- Explores dashboard with saved report
- Sees examples of premium report offerings

### Monetization
- Pathway 1: One-time purchases
  - Upgrades initial report to "Astro Lingo" ($3)
  - Purchases "Mini Deep-Dive" from email/dashboard ($6)
- Pathway 2: Subscription tiers
  - Subscribes to Explorer Tier ($12/mo) from dashboard
  - Upgrades to Navigator Tier ($29/mo) for unlimited access

### Retention
- Receives and opens daily "Astro-Weather" emails
- Logs in to check dashboard periodically
- Uses monthly report credits (Explorer/Navigator)
- Receives special transit alerts (Navigator)
- Explores different report types

---

## 6. Data Models (tables + key fields)

### users
- id (uuid, PK)
- email (string, unique)
- name (string)
- created_at (timestamp)
- last_login (timestamp)
- subscription_tier (enum: free, explorer, navigator)
- subscription_status (enum: active, canceled, past_due)
- email_opt_in (boolean)
- astro_lingo_purchased (boolean)
- referral_source (string)

### birth_data
- id (uuid, PK)
- user_id (uuid, FK)
- name (string)
- birth_date (date)
- birth_time (time)
- birth_place (string)
- latitude (float)
- longitude (float)
- timezone (string)
- time_accuracy (enum: exact, approximate, unknown)
- created_at (timestamp)

### cosmic_reports
- id (uuid, PK)
- user_id (uuid, FK)
- birth_data_id (uuid, FK)
- report_type (enum: blueprint, astro_lingo, mini_deep_dive, premium)
- report_focus (enum: general, career, relationships, etc.)
- chart_data (jsonb) # Raw calculated chart data
- report_content (jsonb) # Structured report sections
- created_at (timestamp)
- shared_count (integer)
- last_viewed (timestamp)

### daily_weather
- id (uuid, PK)
- user_id (uuid, FK)
- birth_data_id (uuid, FK)
- date (date)
- transits_data (jsonb) # Calculated daily transits
- weather_content (jsonb) # Structured daily guidance
- created_at (timestamp)
- email_sent (boolean)
- email_opened (boolean)
- clicked_through (boolean)

### subscriptions
- id (uuid, PK)
- user_id (uuid, FK)
- tier (enum: explorer, navigator)
- status (enum: active, canceled, past_due)
- reports_used (integer) # Monthly usage counter
- premium_reports_used (integer) # For Navigator tier
- started_at (timestamp)
- current_period_end (timestamp)
- cancel_at_period_end (boolean)
- payment_processor (string)
- payment_id (string)

### transactions
- id (uuid, PK)
- user_id (uuid, FK)
- amount (integer) # In cents
- description (string)
- type (enum: one_time_purchase, subscription_payment)
- status (enum: succeeded, failed, refunded)
- processor (string)
- processor_id (string)
- created_at (timestamp)

### prompt_library
- id (uuid, PK)
- prompt_type (enum: blueprint, daily, mini_deep_dive, etc.)
- llm_provider (enum: openai, anthropic, gemini)
- content (text)
- version (integer)
- active (boolean)
- created_at (timestamp)
- last_used (timestamp)
- performance_score (float) # Based on user engagement

### report_templates
- id (uuid, PK)
- section (string)
- report_type (enum: blueprint, daily, mini_deep_dive, etc.)
- language_style (enum: plain_english, astro_lingo)
- template (text)
- created_at (timestamp)
- last_modified (timestamp)

---

## 7. System Architecture (text diagram)

```
+------------------------------------------------+
|                                                |
|  CLIENT LAYER                                  |
|  • Next.js 14 Frontend                         |
|  • PWA Capabilities                            |
|  • Interactive Visualizations                  |
|                                                |
+---------------+------------------------------+--+
                |                              |
                v                              v
+---------------+------------+   +-------------+--------------+
|                            |   |                            |
|  SERVERLESS FUNCTIONS      |   |  DATA & AUTH LAYER         |
|  • Vercel Edge Functions   |   |  • Supabase Auth           |
|  • API Routes              |   |  • PostgreSQL              |
|  • Webhook Handlers        |   |  • pgvector for embeddings |
|                            |   |                            |
+---------------+------------+   +-------------+--------------+
                |                              |
                v                              ^
+---------------+------------------------------+-+
|                                                |
|  CORE BACKEND (Flask)                          |
|  • Swiss Ephemeris Calculations                |
|  • Timezone/Location Processing                |
|  • Chart Generation                            |
|  • LLM Integration                             |
|                                                |
+---------------+------------------------------+--+
                |                              |
                v                              v
+---------------+------------+   +-------------+--------------+
|                            |   |                            |
|  INTEGRATION SERVICES      |   |  SCHEDULED JOBS            |
|  • Email (Resend)          |   |  • Daily Email Generation  |
|  • Payments (Stripe)       |   |  • Transit Calculations    |
|  • Analytics               |   |  • Subscription Management |
|  • Social Sharing          |   |                            |
+----------------------------+   +----------------------------+
```

The architecture follows a modern serverless approach with distinct separation of concerns:

1. **Client Layer:** Handles all user interactions, form collection, and visualizations
2. **Serverless Functions:** Process API requests, handle webhooks, and manage user sessions
3. **Data & Auth Layer:** Manages user data, authentication, and persistent storage
4. **Core Backend:** Performs all astrological calculations and LLM integrations
5. **Integration Services:** Connects to third-party services for email, payments, etc.
6. **Scheduled Jobs:** Handles recurring tasks like daily email generation

This architecture prioritizes scalability, maintainability, and cost-efficiency while allowing for future expansion.

---

## 8. Third-Party Integrations & Cost Notes

### Astrological Engine
- **Swiss Ephemeris**: Zero-COG ephemeris calculations
  - Self-hosted via Python bindings (pyswisseph)
  - Requires downloading ephemeris files once
  - No ongoing costs or API limits

### Infrastructure
- **Vercel**: Frontend hosting and serverless functions
  - Hobby tier: Free for development
  - Pro tier: $20/month (recommended for production)
  - Team tier: $40/user/month (future scaling)

- **Supabase**: Auth, Database, Storage
  - Free tier: Up to 50,000 MAU, 500MB database
  - Pro tier: $25/month for 100,000 MAU, 8GB database
  - Pay as you grow beyond these limits

### LLM Services
- **OpenAI (GPT-4o)**: Primary report generation
  - Input: ~$10/million tokens
  - Output: ~$30/million tokens
  - Est. cost per report: $0.05-0.15
  - Monthly est. (5,000 reports): $250-750

- **Anthropic (Claude Next)**: Backup/specialty reports
  - Input: ~$15/million tokens
  - Output: ~$60/million tokens
  - Used selectively for specific report types

- **Google Gemini (1.5 Pro)**: Tertiary option
  - Competitive pricing, may be used for cost optimization
  - Est. $0.03-0.10 per report

### Email Services
- **Resend**: Primary email delivery
  - $20/month for 50,000 emails
  - Additional emails at $0.80/1,000
  - Est. cost for 5,000 users receiving daily emails: $100/month

- **Mailersend**: Backup provider
  - $25/month for 50,000 emails
  - Similar pricing structure to Resend

### Payment Processing
- **Stripe**: Payment processing
  - 2.9% + $0.30 per transaction
  - No monthly fees
  - Est. cost on $10K MRR: ~$320/month

### Total Estimated Monthly Costs (5,000 MAU)
- Infrastructure: $45-100
- LLM Services: $250-750
- Email Delivery: $100-200
- Payment Processing: $320 (at $10K MRR)
- **Total: $715-1,370/month**

These costs scale roughly linearly with user growth, with some economies of scale at higher volumes.

---

## 9. Open Questions / Assumptions

### Product Strategy
- Will the $3 "Astro Lingo" upgrade convert well enough to justify development effort vs. focusing on subscriptions?
- Should we consider a freemium model with more limited free reports instead of the current approach?
- Is the statistical rarity calculation a strong enough hook for viral sharing?

### Technical Implementation
- How will we handle users with unknown birth times? (Current assumption: offer reduced accuracy reports)
- What level of cached calculations vs. real-time computation is optimal for daily transits?
- How much customization should be allowed in the daily email preferences?

### Marketing & Growth
- What channels will be most effective for initial user acquisition?
- Should we integrate more social sharing features in the MVP?
- How important is localization for early international growth?

### Data & Privacy
- What is our data retention policy for user birth information?
- How will we handle GDPR/CCPA compliance for sensitive user data?
- What level of data security is needed for MVP vs. later stages?

### Business Model
- Are the current price points ($3, $6, $12, $29) optimized for conversion and revenue?
- Should we offer annual plans with discounts in the initial release?
- What is the upgrade path from Explorer to Navigator tier?

### Expansion Strategy
- When should we prioritize the Facilitator License tier development?
- What additional report types would drive the most subscription conversions?
- Should we consider partnerships with existing astrology platforms?

### Assumptions
- Users will provide accurate birth data for better results
- Daily email engagement will be the primary retention driver
- The target audience values accessibility over technical depth initially
- LLM costs will remain stable or decrease over time
- The small team can maintain the core experience with minimal overhead

---

## 10. Milestones & 6-Week Timeline

### Week 1: Foundation & Core Calculation Engine
- Finalize data models and Supabase schema
- Complete Swiss Ephemeris integration and test suite
- Build and test the multi-step birth data collection form
- Establish development environments and workflows

**Deliverable:** Working birth data form with backend calculation engine

### Week 2: Report Generation & Visualization
- Develop LLM prompting system for report generation
- Create interactive chart visualization component
- Implement report sections and templates
- Develop the initial free cosmic blueprint experience

**Deliverable:** End-to-end flow from birth data to generated report

### Week 3: User Management & Astro Lingo Upgrade
- Implement Supabase user authentication
- Build user dashboard with report history
- Develop the $3 Astro Lingo upgrade experience
- Create report saving and sharing functionality

**Deliverable:** Working authentication system and first monetization path

### Week 4: Daily Astro-Weather & Email System
- Develop daily transit calculation system
- Create email templates and personalization logic
- Implement email delivery via Resend
- Build email preference management

**Deliverable:** Functioning daily email system with personalization

### Week 5: Subscription Tiers & Premium Reports
- Implement Stripe integration for subscriptions
- Build Explorer and Navigator tier experiences
- Develop Mini Deep-Dive report generation
- Create subscription management interface

**Deliverable:** Complete subscription and payment system

### Week 6: Polish, Testing & Launch Preparation
- Conduct comprehensive QA across all user journeys
- Optimize performance and mobile experience
- Implement analytics and tracking
- Finalize launch checklist and marketing materials

**Deliverable:** Production-ready application deployed to starclock.me

---

This Product Requirements Document represents our best understanding of the product vision, scope, and implementation plan based on current information. It will serve as our guiding document while allowing for agile adjustments as we learn from user feedback and market response.

**Team:**
- 1.0 AI Alchemist (Product Lead)
- 0.5 AI Architect (Full-Stack Development)
- 0.5 Designer (UX/UI Consultant)
