# Car Problem Reporter

An AI-powered web application for reporting and categorizing car problems using GPT-4. The app provides an intuitive form interface with automatic problem categorization, making it easy to describe vehicle issues and get them properly classified.

## Features

- **AI-Powered Categorization** - Automatically categorizes car problems using OpenAI GPT-4
- **Intuitive Form Interface** - Clean, Apple-inspired design optimized for mobile devices
- **Photo Upload** - Attach images of car problems for better documentation
- **Form Validation** - Built-in validation using Zod schema validation
- **Automatic City Detection** - Smart city selection for location-based services
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Type-Safe** - Built with TypeScript for enhanced code reliability

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Hook Form** - Efficient form management
- **Zod** - Schema validation
- **OpenAI API** - GPT-4 for AI categorization
- **TailwindCSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon set

## Prerequisites

- Node.js 18 or higher
- OpenAI API key
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/stukenov/car-problem-reporter.git
cd car-problem-reporter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Project Settings:
   - Navigate to Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` (the key will be encrypted)
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Heroku
- DigitalOcean
- AWS
- Google Cloud

**Important:** Always set environment variables through your platform's dashboard or CI/CD secrets, never commit `.env` files.

### PM2 (Production Server)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Build the application:
```bash
npm run build
```

3. Start with PM2:
```bash
PORT=3000 pm2 start npm --name "car-problem-reporter" -- start
```

Useful PM2 commands:
```bash
pm2 logs car-problem-reporter    # View logs
pm2 restart car-problem-reporter # Restart app
pm2 stop car-problem-reporter    # Stop app
pm2 delete car-problem-reporter  # Remove from PM2
```

## API Endpoints

### POST /api/categorize

Categorizes car problems using AI.

**Request Body:**
```typescript
{
  problem: string;        // Problem description
  sections: Section[];    // Available categories
  carModel?: string;      // Car model (optional)
}

interface Section {
  id: string;
  title: string;
  subsections: string[];
}
```

**Response:**
```typescript
{
  section: string;     // Selected category
  subsection: string;  // Selected subcategory
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── categorize/    # AI categorization endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── CarProblemForm.tsx # Main form component
└── lib/                  # Utilities and helpers
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |

## Features in Detail

### AI Categorization
The app uses GPT-4 to analyze problem descriptions and automatically select the most appropriate category and subcategory, saving time and ensuring accurate classification.

### Form Validation
All form fields are validated using Zod schemas, ensuring data integrity and providing helpful error messages.

### Responsive Design
The interface adapts to different screen sizes, providing an optimal experience on both mobile and desktop devices.

### Apple-Inspired Design
Clean, minimalist design following Apple's design principles for an intuitive user experience.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions:
- Create an Issue in the repository
- Provide detailed information about the problem
- Include browser version and device information if relevant

## Security

- Never commit API keys or secrets to the repository
- Always use environment variables for sensitive data
- The `.env.local` file is included in `.gitignore` by default

---

**Note:** This application requires an OpenAI API key. Usage costs apply based on OpenAI's pricing. Monitor your usage through the OpenAI dashboard.
