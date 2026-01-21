/**
 * HELP CENTER CONTENT
 * Comprehensive user documentation for ReflectivAI platform
 * NO PROPRIETARY INFORMATION - Public-facing help only
 */

export interface HelpArticle {
  id: string;
  title: string;
  category: HelpCategory;
  content: string;
  keywords: string[];
  relatedArticles?: string[]; // IDs of related articles
}

export type HelpCategory =
  | "getting-started"
  | "ai-coach"
  | "roleplay"
  | "knowledge-base"
  | "frameworks"
  | "modules"
  | "metrics"
  | "troubleshooting"
  | "account";

export const HELP_CATEGORIES: Record<HelpCategory, { name: string; icon: string; description: string }> = {
  "getting-started": {
    name: "Getting Started",
    icon: "Rocket",
    description: "Welcome! Learn the basics of ReflectivAI",
  },
  "ai-coach": {
    name: "AI Coach",
    icon: "MessageSquare",
    description: "Get personalized coaching and feedback",
  },
  "roleplay": {
    name: "Role Play Simulator",
    icon: "Users",
    description: "Practice sales conversations with AI",
  },
  "knowledge-base": {
    name: "Knowledge Base",
    icon: "BookOpen",
    description: "Access pharmaceutical sales resources",
  },
  "frameworks": {
    name: "Frameworks",
    icon: "Layers",
    description: "Learn proven sales methodologies",
  },
  "modules": {
    name: "Coaching Modules",
    icon: "GraduationCap",
    description: "Structured learning paths",
  },
  "metrics": {
    name: "Performance Metrics",
    icon: "BarChart",
    description: "Understand your behavioral scores",
  },
  "troubleshooting": {
    name: "Troubleshooting",
    icon: "AlertCircle",
    description: "Fix common issues",
  },
  "account": {
    name: "Account & Settings",
    icon: "Settings",
    description: "Manage your profile and preferences",
  },
};

export const HELP_ARTICLES: HelpArticle[] = [
  // GETTING STARTED
  {
    id: "welcome",
    title: "Welcome to ReflectivAI",
    category: "getting-started",
    keywords: ["welcome", "introduction", "overview", "what is", "about"],
    content: `
# Welcome to ReflectivAI

ReflectivAI is your AI-powered sales enablement platform designed specifically for pharmaceutical sales representatives. We help you develop the behavioral skills that drive success in healthcare professional (HCP) interactions.

## What Makes ReflectivAI Different?

**AI-Powered Coaching**: Get real-time feedback on your communication skills, not just product knowledge.

**Practice-First Learning**: Learn by doing through realistic roleplay simulations with AI-powered HCPs.

**Behavioral Metrics**: Track 8 core behavioral skills that matter most in pharma sales:
- Empathy & Emotional Intelligence
- Active Listening
- Objection Handling
- Value Articulation
- Relationship Building
- Clinical Credibility
- Adaptability
- Closing Effectiveness

**Pharma-Specific**: Every scenario, framework, and coaching tip is tailored to pharmaceutical sales.

## Quick Start Guide

1. **Explore the AI Coach** - Start a conversation to get personalized coaching
2. **Try a Roleplay** - Practice with an AI-powered physician
3. **Review Your Metrics** - See your behavioral scores and improvement areas
4. **Browse Frameworks** - Learn proven sales methodologies
5. **Complete a Module** - Follow structured learning paths

## Need Help?

Use the search bar above to find answers, or browse articles by category. We're here to help you succeed!
    `,
  },
  {
    id: "quick-start",
    title: "Quick Start: Your First 15 Minutes",
    category: "getting-started",
    keywords: ["quick start", "first time", "beginner", "new user", "tutorial"],
    content: `
# Quick Start: Your First 15 Minutes

New to ReflectivAI? Here's how to get the most out of your first session:

## Step 1: Start with AI Coach (5 minutes)

1. Click **AI Coach** in the sidebar
2. Select your specialty (e.g., Cardiology, Oncology)
3. Choose a conversation starter or ask a question
4. Have a brief coaching conversation

**Try asking**: "How can I handle price objections more effectively?"

## Step 2: Try a Quick Roleplay (5 minutes)

1. Click **Role Play Simulator** in the sidebar
2. Choose a scenario (start with "Initial Meeting")
3. Select HCP type and specialty
4. Have a 3-5 message conversation
5. Review your behavioral scores

**Tip**: Don't worry about being perfect! The goal is to practice and learn.

## Step 3: Review Your Metrics (3 minutes)

1. Click **EI Metrics** in the sidebar
2. See your scores across 8 behavioral dimensions
3. Click on any metric to learn more
4. Note areas for improvement

## Step 4: Explore a Framework (2 minutes)

1. Click **Frameworks** in the sidebar
2. Browse sales methodologies (SPIN, Challenger, etc.)
3. Click "Get AI Advice" on one that interests you
4. Save useful tips for later

## What's Next?

- Complete a full coaching module
- Practice daily with different scenarios
- Track your progress over time
- Explore the Knowledge Base for clinical resources

You're ready to start improving your sales skills!
    `,
  },
  {
    id: "navigation",
    title: "Navigating the Platform",
    category: "getting-started",
    keywords: ["navigation", "sidebar", "menu", "pages", "how to find"],
    content: `
# Navigating the Platform

ReflectivAI is organized into 8 main sections, accessible from the sidebar:

## 📊 Dashboard
Your home base. See recent activity, progress summary, and quick access to key features.

## 💬 AI Coach
Have coaching conversations about any sales challenge. Get personalized advice, practice scenarios, and skill-building tips.

**Best for**: Quick questions, strategy discussions, objection handling practice

## 🎭 Role Play Simulator
Practice realistic HCP conversations with AI. Get scored on 8 behavioral metrics and receive detailed feedback.

**Best for**: Hands-on practice, preparing for real calls, building confidence

## 📚 Knowledge Base
Access pharmaceutical sales resources, clinical information, and market access guidance. Ask AI questions about any article.

**Best for**: Research, clinical data, compliance guidelines, market access

## 🧩 Frameworks
Learn proven sales methodologies (SPIN, Challenger, DISC, etc.). Get AI-powered advice on applying them to your situations.

**Best for**: Learning new techniques, refreshing fundamentals, strategic planning

## 🎓 Coaching Modules
Structured learning paths with exercises, practice questions, and AI-generated coaching content.

**Best for**: Systematic skill development, onboarding, certification prep

## 📈 EI Metrics
Track your behavioral scores across 8 dimensions. See progress over time and identify improvement areas.

**Best for**: Performance tracking, goal setting, identifying strengths/weaknesses

## ❓ Help Center (You are here!)
Searchable documentation, FAQs, and troubleshooting guides.

**Best for**: Learning how to use features, fixing issues, understanding metrics

## Tips for Efficient Navigation

- Use **keyboard shortcuts**: Click your profile icon to see available shortcuts
- **Search within pages**: Most pages have search or filter functionality
- **Bookmark frequently used pages**: Use your browser's bookmark feature
- **Mobile-friendly**: All features work on mobile devices
    `,
  },

  // AI COACH
  {
    id: "ai-coach-overview",
    title: "How to Use AI Coach",
    category: "ai-coach",
    keywords: ["ai coach", "coaching", "conversation", "chat", "ask questions"],
    content: `
# How to Use AI Coach

The AI Coach is your personal sales coach, available 24/7 to help you improve your skills.

## What Can AI Coach Help With?

- **Objection Handling**: Practice responses to common objections
- **Value Propositions**: Craft compelling benefit statements
- **Relationship Building**: Get advice on building HCP rapport
- **Clinical Discussions**: Prepare for data-driven conversations
- **Call Planning**: Strategize before important meetings
- **Skill Development**: Work on specific behavioral competencies

## How to Start a Conversation

1. **Select Your Context** (optional but recommended):
   - Disease State (e.g., Cardiovascular, Oncology)
   - Specialty (e.g., Cardiologist, Oncologist)
   - HCP Category (e.g., Key Opinion Leader, Community Physician)
   - Influence Driver (e.g., Clinical Data, Patient Outcomes)

2. **Choose a Conversation Starter** or type your own question

3. **Have a Natural Conversation**: The AI adapts to your needs

## Tips for Better Coaching

✅ **Be Specific**: "How do I handle price objections in cardiology?" is better than "Help me with objections"

✅ **Provide Context**: Share details about your situation, the HCP, or your challenges

✅ **Ask Follow-Up Questions**: Dig deeper into advice that resonates

✅ **Practice Out Loud**: Try saying responses aloud to build confidence

✅ **Take Notes**: Save useful phrases and strategies for real calls

## Signal Intelligence

As you chat, the AI detects behavioral signals in your messages:
- **Verbal Signals**: Word choice, tone, confidence
- **Conversational Signals**: Question quality, listening cues
- **Engagement Signals**: Curiosity, openness to feedback
- **Contextual Signals**: Situation awareness, adaptability

These signals help the AI provide more personalized coaching.

## Example Conversations

**Objection Handling**:
- You: "A physician said our product is too expensive. How should I respond?"
- AI: Provides Feel-Felt-Found framework, value-based responses, and practice scenarios

**Call Preparation**:
- You: "I'm meeting a skeptical oncologist tomorrow. What should I focus on?"
- AI: Suggests research to do, key messages, potential objections, and opening strategies

**Skill Development**:
- You: "My active listening scores are low. How can I improve?"
- AI: Explains the skill, provides techniques, and offers practice exercises

## Conversation History

Your conversations are saved automatically. You can:
- Review past coaching sessions
- Continue previous conversations
- Clear history to start fresh (Settings icon → Clear Chat)

## Privacy Note

Conversations are private and used only to improve your coaching experience. No proprietary product information should be shared.
    `,
  },
  {
    id: "conversation-starters",
    title: "Using Conversation Starters",
    category: "ai-coach",
    keywords: ["conversation starters", "prompts", "suggestions", "topics"],
    content: `
# Using Conversation Starters

Conversation starters are AI-generated prompts tailored to your selected context (disease state, specialty, HCP type).

## How They Work

1. **Select Your Context**: Choose disease state, specialty, HCP category, and influence driver
2. **View Starters**: See 4-6 relevant conversation prompts
3. **Click to Use**: Tap any starter to begin that conversation
4. **Refresh for More**: Click the refresh icon to generate new starters

## Types of Starters

**Objection Handling**:
- "How do I address concerns about side effects in elderly patients?"
- "What's the best way to handle formulary access objections?"

**Value Articulation**:
- "How can I differentiate our product in a crowded market?"
- "What value proposition resonates most with community cardiologists?"

**Relationship Building**:
- "How do I build trust with a skeptical KOL?"
- "What's the best way to follow up after an initial meeting?"

**Clinical Discussions**:
- "How should I present Phase 3 data to a data-driven oncologist?"
- "What clinical evidence matters most for this specialty?"

## Customizing Your Experience

**Change Context**: Update your selections to get different starters

**Enable DISC**: Toggle DISC personality insights for communication style tips

**Suggested Topics**: Below starters, see broader topics you can explore

## Tips

- Starters are just suggestions - you can ask anything!
- Use starters when you're not sure what to practice
- Combine multiple starters into one conversation
- Modify starters to fit your specific situation

## Mobile Optimization

On mobile devices, starters are displayed vertically with larger touch targets for easy selection.
    `,
  },

  // ROLEPLAY
  {
    id: "roleplay-overview",
    title: "Role Play Simulator Guide",
    category: "roleplay",
    keywords: ["roleplay", "role play", "simulation", "practice", "hcp conversation"],
    content: `
# Role Play Simulator Guide

The Role Play Simulator lets you practice realistic HCP conversations with AI-powered physicians. Get scored on 8 behavioral metrics and receive detailed feedback.

## How It Works

1. **Choose a Scenario**:
   - Initial Meeting
   - Follow-Up Visit
   - Objection Handling
   - Clinical Data Discussion
   - Closing/Commitment

2. **Select HCP Profile**:
   - Type: KOL, Community Physician, Resident, etc.
   - Specialty: Cardiologist, Oncologist, Neurologist, etc.
   - Personality: Analytical, Skeptical, Supportive, etc.

3. **Have the Conversation**:
   - The AI HCP responds realistically
   - Type your responses as you would in a real call
   - Aim for 5-10 message exchanges

4. **Get Scored**:
   - Receive scores on 8 behavioral metrics (0-100)
   - See specific feedback on what you did well
   - Get actionable improvement suggestions

5. **Review Detailed Feedback**:
   - Conversation replay with annotations
   - Missed opportunities highlighted
   - Alternative responses suggested

## The 8 Behavioral Metrics

You're scored on:
1. **Empathy & Emotional Intelligence** - Understanding HCP emotions
2. **Active Listening** - Engaging with HCP's points
3. **Objection Handling** - Addressing concerns professionally
4. **Value Articulation** - Communicating benefits clearly
5. **Relationship Building** - Establishing trust
6. **Clinical Credibility** - Demonstrating product knowledge
7. **Adaptability** - Adjusting to HCP responses
8. **Closing Effectiveness** - Moving toward next steps

## Tips for Better Scores

✅ **Listen First**: Ask questions before pitching
✅ **Acknowledge Concerns**: Validate objections before responding
✅ **Use Data**: Reference clinical evidence when appropriate
✅ **Be Natural**: Write as you would speak
✅ **Ask for Next Steps**: Don't end without a clear action

## Practice Strategies

**Daily Practice**: Do one 5-minute roleplay per day
**Focus Areas**: Target your lowest-scoring metrics
**Variety**: Try different scenarios and HCP types
**Repetition**: Replay the same scenario to improve
**Real Prep**: Practice before actual HCP calls

## Understanding Your Scores

- **80-100**: Excellent - You're demonstrating mastery
- **60-79**: Good - Solid performance with room to grow
- **40-59**: Needs Work - Focus on improvement strategies
- **0-39**: Poor - Requires significant development

## After the Roleplay

- Review feedback carefully
- Note 2-3 specific things to improve
- Practice those skills in your next roleplay
- Track progress over time in EI Metrics
    `,
  },
  {
    id: "roleplay-scenarios",
    title: "Choosing the Right Scenario",
    category: "roleplay",
    keywords: ["scenarios", "situation", "type", "which scenario"],
    content: `
# Choosing the Right Scenario

Different scenarios help you practice different skills. Here's how to choose:

## Initial Meeting
**Best for**: Relationship building, first impressions, discovery

**Skills practiced**:
- Opening conversations
- Building rapport
- Asking discovery questions
- Establishing credibility

**Use when**: You're new to a territory or meeting new HCPs

## Follow-Up Visit
**Best for**: Deepening relationships, addressing previous discussions

**Skills practiced**:
- Referencing past conversations
- Following through on commitments
- Advancing the relationship
- Providing value beyond product

**Use when**: You want to practice ongoing relationship management

## Objection Handling
**Best for**: Addressing concerns, overcoming resistance

**Skills practiced**:
- Acknowledging objections
- Providing evidence-based responses
- Reframing concerns
- Maintaining rapport under pressure

**Use when**: You're struggling with specific objections

## Clinical Data Discussion
**Best for**: Presenting evidence, discussing efficacy/safety

**Skills practiced**:
- Citing clinical data accurately
- Explaining mechanism of action
- Addressing data questions
- Building clinical credibility

**Use when**: You need to strengthen clinical conversations

## Closing/Commitment
**Best for**: Asking for next steps, securing commitments

**Skills practiced**:
- Recognizing closing opportunities
- Using trial closes
- Asking for commitment
- Confirming next actions

**Use when**: You struggle to move conversations forward

## Mixing Scenarios

For well-rounded practice:
- **Monday**: Initial Meeting
- **Tuesday**: Clinical Data Discussion
- **Wednesday**: Objection Handling
- **Thursday**: Follow-Up Visit
- **Friday**: Closing/Commitment

## Scenario Difficulty

**Easier**: Initial Meeting, Follow-Up Visit
**Moderate**: Clinical Data Discussion
**Harder**: Objection Handling, Closing/Commitment

Start easier and progress to harder scenarios as you improve.
    `,
  },

  // METRICS
  {
    id: "metrics-overview",
    title: "Understanding Your Behavioral Metrics",
    category: "metrics",
    keywords: ["metrics", "scores", "behavioral", "performance", "ei metrics"],
    content: `
# Understanding Your Behavioral Metrics

ReflectivAI tracks 8 behavioral metrics that drive success in pharmaceutical sales. Here's what they mean and how to improve them.

## The 8 Core Metrics

### 1. Empathy & Emotional Intelligence
**What it measures**: Your ability to understand and respond to HCP emotions

**Why it matters**: HCPs are more receptive when they feel heard and understood

**How to improve**:
- Acknowledge HCP concerns before responding
- Use phrases like "I understand" and "That makes sense"
- Ask about HCP's experiences and challenges
- Validate emotions, even when you disagree

### 2. Active Listening
**What it measures**: How well you engage with and comprehend HCP communication

**Why it matters**: Better listening leads to more relevant, persuasive responses

**How to improve**:
- Ask clarifying questions
- Paraphrase what you heard
- Reference earlier points in the conversation
- Avoid interrupting
- Use the 80/20 rule: listen 80%, talk 20%

### 3. Objection Handling
**What it measures**: Your ability to address concerns professionally

**Why it matters**: Objections are opportunities to build trust and credibility

**How to improve**:
- Use Feel-Felt-Found framework
- Ask questions to understand root concerns
- Provide evidence-based responses
- Stay calm and professional
- Validate objections before responding

### 4. Value Articulation
**What it measures**: How clearly you communicate product benefits

**Why it matters**: HCPs need to understand value to prescribe

**How to improve**:
- Connect features to HCP-stated needs
- Use clinical data to support claims
- Focus on patient outcomes
- Tailor value to HCP's specialty
- Quantify benefits when possible

### 5. Relationship Building
**What it measures**: Your ability to establish trust and long-term connections

**Why it matters**: Strong relationships lead to access, influence, and loyalty

**How to improve**:
- Ask about HCP's practice and interests
- Follow up on previous conversations
- Offer value beyond product information
- Be reliable and consistent
- Find common ground

### 6. Clinical Credibility
**What it measures**: Your product and disease state knowledge

**Why it matters**: HCPs trust reps who know their stuff

**How to improve**:
- Memorize key clinical data points
- Practice explaining mechanism of action
- Stay current on guidelines and competitor data
- Know when to say "I don't know" and follow up
- Use medical terminology correctly

### 7. Adaptability
**What it measures**: How well you adjust to HCP responses and context

**Why it matters**: Flexibility shows professionalism and customer focus

**How to improve**:
- Read verbal and contextual cues
- Adjust pace when HCP signals time pressure
- Pivot when an approach isn't working
- Prepare multiple conversation pathways
- Stay comfortable with non-linear discussions

### 8. Closing Effectiveness
**What it measures**: Your ability to move conversations toward next steps

**Why it matters**: Calls without clear next actions waste everyone's time

**How to improve**:
- Use trial closes throughout conversation
- Recognize buying signals
- Summarize value before asking for commitment
- Ask for specific next actions
- Confirm understanding and agreement

## Score Ranges

- **80-100**: Excellent - Demonstrating mastery
- **60-79**: Good - Solid performance
- **40-59**: Needs Work - Focus here
- **0-39**: Poor - Requires development

## Tracking Progress

View your metrics in the **EI Metrics** page:
- See current scores across all 8 dimensions
- Track progress over time
- Identify strengths and weaknesses
- Set improvement goals

## Improvement Strategy

1. **Identify Your Lowest 2-3 Metrics**
2. **Read Detailed Guidance** (click metric cards)
3. **Practice Targeted Roleplays** (focus on those skills)
4. **Review Feedback** (note specific improvements)
5. **Track Progress** (watch scores improve over time)

Consistent practice leads to measurable improvement!
    `,
  },

  // TROUBLESHOOTING
  {
    id: "ai-not-responding",
    title: "AI Not Responding or Slow",
    category: "troubleshooting",
    keywords: ["not working", "slow", "loading", "timeout", "error", "broken"],
    content: `
# AI Not Responding or Slow

If the AI Coach, Roleplay, or other AI features aren't working, try these solutions:

## Common Causes

### 1. Network Connection Issues
**Symptoms**: Long loading times, timeout errors

**Solutions**:
- Check your internet connection
- Try refreshing the page (F5 or Cmd+R)
- Switch to a different network if possible
- Disable VPN temporarily

### 2. Browser Issues
**Symptoms**: Features not loading, blank screens

**Solutions**:
- Clear browser cache and cookies
- Try a different browser (Chrome, Firefox, Safari)
- Disable browser extensions temporarily
- Update your browser to the latest version

### 3. Server Timeout
**Symptoms**: "Request timed out" or "No response" messages

**Solutions**:
- Wait 30 seconds and try again
- Refresh the page
- Try a shorter, simpler message
- Check if other AI features work (to isolate the issue)

### 4. Session Expired
**Symptoms**: Logged out unexpectedly, features stop working

**Solutions**:
- Log out and log back in
- Clear browser cache
- Check if your session timed out (after 2 hours of inactivity)

## Quick Fixes

### For AI Coach:
1. Click the Settings icon (top right)
2. Select "Clear Chat"
3. Start a new conversation

### For Roleplay:
1. Return to scenario selection
2. Start a new roleplay
3. If issue persists, refresh the page

### For Knowledge Base:
1. Try a different article
2. Refresh the page
3. Clear your search and try again

## Still Not Working?

### Check System Status
- Look for any status messages at the top of the page
- Check if other users are experiencing issues

### Try These Steps:
1. **Log out completely**
2. **Clear browser cache and cookies**
3. **Close all browser tabs**
4. **Restart your browser**
5. **Log back in**

### Report the Issue
If problems persist:
1. Note what you were trying to do
2. Take a screenshot of any error messages
3. Note your browser and operating system
4. Contact support with these details

## Prevention Tips

- Keep your browser updated
- Use a stable internet connection
- Clear cache weekly
- Log out when finished (especially on shared computers)
- Avoid extremely long messages (keep under 500 words)

## Known Limitations

- AI responses may take 5-15 seconds
- Very complex questions may timeout (try breaking into smaller questions)
- Multiple simultaneous requests may slow performance
- Mobile networks may be slower than WiFi
    `,
  },
  {
    id: "scores-not-updating",
    title: "Scores Not Updating",
    category: "troubleshooting",
    keywords: ["scores", "metrics", "not updating", "stuck", "wrong score"],
    content: `
# Scores Not Updating

If your behavioral metric scores aren't updating after roleplays, try these solutions:

## Common Causes

### 1. Roleplay Not Completed
**Issue**: Scores only update after completing a full roleplay

**Solution**:
- Complete at least 5 message exchanges
- End the roleplay properly (don't just close the page)
- Wait for the feedback screen to appear

### 2. Browser Cache
**Issue**: Old scores cached in browser

**Solution**:
1. Refresh the EI Metrics page (F5 or Cmd+R)
2. Clear browser cache
3. Log out and log back in

### 3. Session Issues
**Issue**: Scores saved to wrong session

**Solution**:
1. Check if you're logged in
2. Verify you're using the same account
3. Clear chat history and start fresh session

## Verification Steps

1. **Complete a Test Roleplay**:
   - Do a quick 5-message roleplay
   - Note your starting scores
   - Complete the roleplay
   - Check if scores updated

2. **Check Roleplay Feedback**:
   - After roleplay, review the feedback screen
   - Scores should be displayed there
   - If they appear there but not in EI Metrics, it's a sync issue

3. **Refresh Multiple Times**:
   - Sometimes scores take 10-30 seconds to sync
   - Refresh the EI Metrics page a few times
   - Wait 1 minute between refreshes

## Understanding Score Updates

### How Scores Are Calculated
- Scores are based on your most recent roleplays
- Each metric is scored independently (0-100)
- Scores reflect patterns, not single messages
- More practice = more accurate scores

### When Scores Update
- **Immediately**: After completing a roleplay
- **Aggregated**: EI Metrics page shows rolling average
- **Historical**: Past scores are preserved

### Why Scores Might Not Change Much
- You're consistently performing at the same level
- Need more practice to show improvement
- Focusing on wrong areas (check feedback for guidance)

## Still Having Issues?

### Try This:
1. **Clear All Data**:
   - AI Coach: Clear chat history
   - Browser: Clear cache and cookies
   - Log out and log back in

2. **Start Fresh**:
   - Complete 3 new roleplays
   - Check if scores update after each one
   - If they do, the issue is resolved

3. **Check Browser Console**:
   - Press F12 (or Cmd+Option+I on Mac)
   - Look for error messages
   - Take a screenshot if you see errors

### Report the Issue
If scores still don't update:
1. Note which metrics aren't updating
2. Record when you last saw them update
3. List recent roleplays you completed
4. Contact support with these details

## Prevention Tips

- Complete roleplays fully (don't abandon mid-conversation)
- Wait for feedback screen before closing
- Practice regularly (daily is best)
- Use the same browser and account
- Clear cache weekly
    `,
  },

  // KNOWLEDGE BASE
  {
    id: "knowledge-base-search",
    title: "Searching the Knowledge Base",
    category: "knowledge-base",
    keywords: ["search", "find", "articles", "knowledge base", "resources"],
    content: `
# Searching the Knowledge Base

The Knowledge Base contains pharmaceutical sales resources, clinical information, and market access guidance. Here's how to find what you need:

## Search Methods

### 1. Keyword Search
- Type keywords in the search bar
- Use specific terms (e.g., "cardiovascular outcomes" not "heart")
- Try multiple search terms if first attempt doesn't work

### 2. Category Filtering
Browse by category:
- **Clinical Data**: Efficacy, safety, MOA, trial results
- **Market Access**: Formulary, reimbursement, payer strategies
- **Compliance**: Regulations, guidelines, legal requirements
- **Sales Techniques**: Methodologies, best practices, tips

### 3. AI-Powered Q&A
- Ask questions in natural language
- Get AI-generated answers based on article content
- Available on both article pages and main Knowledge Base page

## Search Tips

✅ **Be Specific**: "Phase 3 trial results cardiovascular" > "trial results"
✅ **Use Medical Terms**: "myocardial infarction" > "heart attack"
✅ **Try Synonyms**: "efficacy" = "effectiveness" = "outcomes"
✅ **Filter First**: Select category, then search within it
✅ **Use AI Q&A**: Ask "What are the key safety findings?" instead of searching

## AI Q&A Features

### General Q&A (Top of Page)
Ask questions about any topic:
- "What are the latest guidelines for diabetes management?"
- "How do I explain MOA to a busy physician?"
- "What's the difference between formulary tiers?"

### Article-Specific Q&A
Ask questions about the current article:
- "What were the primary endpoints?"
- "How does this compare to competitors?"
- "What are the key takeaways for my specialty?"

## Finding Specific Information

### Clinical Data
**Search for**: Trial names, endpoints, efficacy rates, safety profiles
**Example**: "ASCEND trial primary endpoint"

### Market Access
**Search for**: Formulary status, prior authorization, reimbursement
**Example**: "Medicare Part D coverage criteria"

### Compliance
**Search for**: FDA regulations, off-label, promotional guidelines
**Example**: "FDA promotional guidelines cardiovascular"

### Sales Techniques
**Search for**: Objection handling, value propositions, call planning
**Example**: "handling price objections oncology"

## Saving Useful Articles

- **Bookmark in Browser**: Use browser bookmarks for quick access
- **Take Notes**: Copy key points to your CRM or notes app
- **Share Links**: Send article URLs to colleagues

## No Results?

### Try These:
1. **Broaden Your Search**: Use fewer, more general terms
2. **Check Spelling**: Verify medical terms are spelled correctly
3. **Use AI Q&A**: Ask your question directly instead of searching
4. **Browse Categories**: Explore related categories manually
5. **Try Different Terms**: "adverse events" vs "side effects" vs "safety"

## Mobile Search

- Search bar is always accessible at top
- Category filters work the same as desktop
- AI Q&A optimized for mobile typing
- Swipe to navigate between articles
    `,
  },

  // FRAMEWORKS
  {
    id: "frameworks-overview",
    title: "Using Sales Frameworks",
    category: "frameworks",
    keywords: ["frameworks", "methodologies", "spin", "challenger", "disc"],
    content: `
# Using Sales Frameworks

Sales frameworks are proven methodologies that guide your HCP interactions. ReflectivAI helps you learn and apply them.

## Available Frameworks

### SPIN Selling
**Best for**: Discovery, needs analysis
**Key concept**: Ask Situation, Problem, Implication, Need-Payoff questions
**Use when**: Initial meetings, understanding HCP challenges

### Challenger Sale
**Best for**: Teaching, differentiating
**Key concept**: Teach, Tailor, Take Control
**Use when**: Competitive situations, need to stand out

### DISC Personality Types
**Best for**: Adapting communication style
**Key concept**: Dominance, Influence, Steadiness, Conscientiousness
**Use when**: Building rapport, tailoring approach

### Active Listening Framework
**Best for**: Understanding HCP needs
**Key concept**: Listen, Clarify, Reflect, Respond
**Use when**: Every conversation!

### Objection Handling (Feel-Felt-Found)
**Best for**: Addressing concerns
**Key concept**: Empathize, Relate, Resolve
**Use when**: HCP raises objections or concerns

### Value Selling
**Best for**: Articulating benefits
**Key concept**: Features → Benefits → Evidence → Application
**Use when**: Presenting product value

## How to Use Frameworks

### 1. Learn the Framework
- Read the framework description
- Understand the key concepts
- Review example scenarios

### 2. Get AI Advice
- Click "Get AI Advice" on any framework
- Describe your specific situation
- Receive customized guidance

### 3. Practice Application
- Use the framework in roleplays
- Apply it to real HCP conversations
- Refine your approach based on results

### 4. Combine Frameworks
- Use SPIN for discovery + Value Selling for presentation
- Apply DISC to adapt Challenger approach
- Combine Active Listening with any framework

## AI-Powered Customization

For each framework, you can:
- **Get Advice**: General guidance on using the framework
- **Customize Template**: Adapt framework to your specific situation
- **See Examples**: View pharma-specific use cases
- **Practice**: Apply in roleplay simulations

## Tips for Success

✅ **Start with One**: Master one framework before adding more
✅ **Practice Daily**: Use in roleplays and real calls
✅ **Be Natural**: Frameworks guide, they don't script
✅ **Adapt**: Modify frameworks to fit your style
✅ **Combine**: Use multiple frameworks in one conversation

## Common Mistakes

❌ **Too Rigid**: Following framework like a script
❌ **Too Many**: Trying to use all frameworks at once
❌ **No Practice**: Learning but not applying
❌ **Wrong Context**: Using framework in inappropriate situation

## Recommended Learning Path

**Week 1**: Active Listening (foundation for all others)
**Week 2**: SPIN Selling (discovery and needs analysis)
**Week 3**: Value Selling (articulating benefits)
**Week 4**: Objection Handling (addressing concerns)
**Week 5**: Challenger Sale (differentiation)
**Week 6**: DISC (adapting to personalities)

## Measuring Success

Frameworks improve your behavioral metrics:
- **Active Listening** → Active Listening score
- **SPIN** → Empathy, Active Listening scores
- **Value Selling** → Value Articulation score
- **Objection Handling** → Objection Handling score
- **Challenger** → Clinical Credibility, Adaptability scores
- **DISC** → Adaptability, Relationship Building scores

Track your metrics to see which frameworks help most!
    `,
  },
];

/**
 * Search help articles by keyword
 */
export function searchHelpArticles(query: string): HelpArticle[] {
  if (!query || query.trim().length < 2) return [];
  
  const lowerQuery = query.toLowerCase().trim();
  const terms = lowerQuery.split(/\s+/);
  
  return HELP_ARTICLES
    .map((article) => {
      let score = 0;
      
      // Check title (highest weight)
      if (article.title.toLowerCase().includes(lowerQuery)) score += 10;
      terms.forEach((term) => {
        if (article.title.toLowerCase().includes(term)) score += 5;
      });
      
      // Check keywords (high weight)
      article.keywords.forEach((keyword) => {
        if (keyword.includes(lowerQuery)) score += 8;
        terms.forEach((term) => {
          if (keyword.includes(term)) score += 3;
        });
      });
      
      // Check content (lower weight)
      if (article.content.toLowerCase().includes(lowerQuery)) score += 2;
      terms.forEach((term) => {
        if (article.content.toLowerCase().includes(term)) score += 1;
      });
      
      return { article, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.article);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: HelpCategory): HelpArticle[] {
  return HELP_ARTICLES.filter((article) => article.category === category);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.id === id);
}

/**
 * Get related articles
 */
export function getRelatedArticles(articleId: string): HelpArticle[] {
  const article = getArticleById(articleId);
  if (!article) return [];
  
  // Get articles in same category
  const sameCategory = getArticlesByCategory(article.category).filter(
    (a) => a.id !== articleId
  );
  
  // Get explicitly related articles
  const explicitlyRelated = (article.relatedArticles || [])
    .map(getArticleById)
    .filter((a): a is HelpArticle => a !== undefined);
  
  // Combine and deduplicate
  const related = [...explicitlyRelated, ...sameCategory];
  const seen = new Set<string>();
  return related.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  }).slice(0, 5);
}
