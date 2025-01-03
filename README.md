# Wedding Web

A modern, responsive wedding website built using Next.js and styled with Tailwind CSS.

## Features
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Event Details:** Share wedding date, venue, schedule, and other important information.
- **RSVP Form:** Allow guests to confirm their attendance directly from the website.
- **Gallery:** Showcase beautiful photos and memories.
- **Countdown Timer:** Countdown to your special day.
- **Performance Optimized:** Fast and efficient, leveraging Next.js.

## Technologies Used
- **Framework:** [Next.js](https://nextjs.org/) (React-based framework for production-ready applications).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for fast and modern UI development.
- **State Management:** React hooks.
- **Icons:** [Lucide React](https://lucide.dev/) for elegant and customizable icons.

## Getting Started

### Prerequisites
- Node.js (version 16 or above)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/nurd0tid/my-weeding.git
   ```
2. Navigate to the project directory:
   ```bash
   cd wedding-web
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development
Start the development server:
```bash
npm run dev
# or
yarn dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production
To build the project for production, run:
```bash
npm run build
# or
yarn build
```
Then, start the production server:
```bash
npm start
# or
yarn start
```

### Linting
Ensure your code follows the best practices:
```bash
npm run lint
# or
yarn lint
```

## Project Structure
```
├── components/         # Reusable UI components
├── pages/              # Next.js pages
├── public/             # Static assets (images, fonts, etc.)
├── styles/             # Global and Tailwind CSS styles
├── utils/              # Utility functions
├── package.json        # Project metadata and dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

## Customization
- **Tailwind Configuration:** Customize colors, fonts, and themes in `tailwind.config.js`.
- **Components:** Modify or add components in the `components/` directory to suit your needs.

## Deployment
This project can be deployed on platforms like Vercel, Netlify, or any static hosting service.

### Deploy on Vercel
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Follow the deployment steps and your website will be live.

## Acknowledgments
- **Next.js** for an amazing development experience.
- **Tailwind CSS** for rapid and customizable styling.
- **Lucide React** for beautiful and consistent icons.

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.