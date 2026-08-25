# Planlite — Event Management App

A web application for planning and managing personal events. Users create an
account, plan events through a guided wizard (title → date → location →
services), track upcoming/past events, and manage event details with a
checklist and a program lineup.

Built with **React 19 + TypeScript + Vite**, backed by a lightweight
[json-server](https://github.com/typicode/json-server) mock API for
development. There is no production backend yet — all data lives in local JSON
files served by json-server.

---

## Features

- **User authentication**
  - Sign up with first name, last name, email, and password
  - Log in with email + password (validated against the local users API)
  - "Continue with Google" button (UI only — not wired to an OAuth provider)
  - Password reset flow (email verification → reset screen)
- **Event planning wizard** (4 steps, progress indicator in the sidebar)
  1. Event title
  2. Event date (single day or multi-day range via calendar)
  3. Event location (pick a region, then a hotel/venue)
  4. Event services (8 categories: photography, entertainment, design,
     hiring, transport, planner, catering, beauty/grooming)
- **Dashboard**
  - Sidebar navigation: Events, Services, Notifications
  - **Upcoming events** tab with a hero card for the nearest upcoming event
  - **Past events** tab with the ability to replan an expired event
- **Event details**
  - View event info (date, location, planned by)
  - Manage a **checklist** of to-do items (add, toggle done, rename, delete)
  - Manage a **program lineup** (time + title + responsible person; add,
    edit, delete)
  - **Services tab** with a vendor marketplace to browse and book services
  - Booked vendor services render in the **Services** section above the
    checklist and program lineup (replacing the "No services booked yet"
    empty state)
- **Vendor services marketplace** (within the event details Services tab)
  - Search bar + button
  - Filter dropdowns for price range, location, category, and rating
  - Shows all categories by default; selecting a category narrows results
  - Category sections show vendor cards (photo, name, rate, location,
    rating, description) with a **View More** button per category
  - **Vendor Detail Modal** with image gallery (prev/next navigation),
    details tab, and notes tab for adding/editing/deleting notes about the vendor
  - **Contact Modal** with call, email, and WhatsApp options
  - **Add to Event / Remove from Event** toggle button
  - **Book Service** assigns a vendor to the current event (or prompts for an
    event when browsed standalone)
- **Replan**: re-open the planning wizard for a past event and update it

> `Services` (sidebar) and `Notifications` pages are placeholder stubs at the
> moment. The vendor marketplace lives inside the **event details** page.

---

## Tech Stack

| Area          | Technology                                             |
| ------------- | ------------------------------------------------------ |
| Framework     | [React](https://react.dev) 19 + TypeScript 5.9          |
| Build tool    | [Vite](https://vite.dev) 7                              |
| Routing       | [react-router-dom](https://reactrouter.com) 7           |
| Forms         | [react-hook-form](https://react-hook-form.com)          |
| Validation    | [Zod](https://zod.dev) + `@hookform/resolvers`          |
| HTTP client   | [Axios](https://axios-http.com)                         |
| Date handling | [date-fns](https://date-fns.org) + [react-calendar](https://github.com/wojtekmaj/react-calendar) |
| Icons         | [react-icons](https://react-icons.github.io/react-icons) |
| Mock API      | [json-server](https://github.com/typicode/json-server)   |
| Linting       | ESLint + typescript-eslint + react-hooks + react-refresh |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (Vite 7 requires Node 20.19+ / 22.12+)
- **npm** (comes with Node)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock backend (json-server)

The app talks to two json-server instances:

| Port | Data file               | Resources         | Used by                          |
| ---- | ----------------------- | ----------------- | -------------------------------- |
| 8000 | `src/data/data.json`    | `users`           | Sign up, login, password reset   |
| 9000 | `src/data/events.json`  | `events`          | Event creation, list, details    |

Run each in a separate terminal:

```bash
npx json-server src/data/data.json --port 8000
npx json-server src/data/events.json --port 9000
```

> These ports are hard-coded throughout the app (e.g. `axios.get("http://localhost:9000/events")`).
> Keep them free, or update the URLs in the source if you change them.

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Demo account

Use any user seeded in `src/data/data.json`, for example:

```
email:    sam@gmail.com
password: evenSam1
```

---

## Project Structure

```
event-app/
├── index.html                  # Vite entry HTML
├── package.json                # Scripts + dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig*.json              # TypeScript project configs
├── eslint.config.js            # ESLint flat config
├── public/                     # Static assets (favicon)
└── src/
    ├── main.tsx                # React root (StrictMode + App)
    ├── App.tsx                 # Route definitions (react-router)
    ├── assets/                 # Images (map, schedule, calendar, note)
    ├── css/                    # Plain-CSS stylesheets, one per feature
    ├── data/
    │   ├── data.json           # json-server seed: users
    │   ├── events.json         # json-server seed: events
    │   └── vendors.ts          # static vendor catalog (categories + vendors)
    ├── entities/               # TypeScript interfaces (data models)
    ├── hooks/                  # Utilities (capitalize, location catalog)
    └── components/             # React components (pages + UI parts)
        ├── Login.tsx           #   /         – login page
        ├── SignUp.tsx          #   /signup   – sign-up page
        ├── Message.tsx         #   /message  – password-reset sent notice
        ├── LastStep.tsx        #   /last-step – post-signup notice
        ├── PageLayout.tsx      #   /page-layout – dashboard shell (sidebar + outlet)
        ├── HomeContent.tsx     #   default tab – upcoming/past toggle
        ├── Upcoming.tsx        #   upcoming events list + wizard host
        ├── PastEvents.tsx      #   past (expired) events list
        ├── Event.tsx           #   active events grid
        ├── Details.tsx         #   /details/:id – details, services tab, checklist, program
        ├── VendorMarketplace.tsx # vendor marketplace (search + filters + booking)
        ├── VendorDetailModal.tsx # vendor detail modal (image gallery, details, notes)
        ├── ContactModal.tsx    # contact modal (call, email, WhatsApp)
        ├── Replan.tsx          #   /replan/:id – edit a past event
        ├── Services.tsx        #   placeholder (sidebar Services page)
        ├── Notifications.tsx   #   placeholder
        ├── NavBar.tsx          #   page header with tabs
        ├── SideBar.tsx         #   dashboard sidebar (responsive)
        ├── SideMenu.tsx        #   sidebar navigation menu
        ├── SideCircle.tsx      #   wizard step progress indicator
        ├── EventTitle.tsx      #   wizard step 1
        ├── EventDate.tsx       #   wizard step 2 (calendar)
        ├── EventLocation.tsx   #   wizard step 3 (region → venue)
        ├── EventServices.tsx   #   wizard step 4 (service checkboxes)
        ├── CheckModal.tsx      #   add checklist item modal
        ├── ProgramModal.tsx    #   add program-lineup item modal
        ├── Button.tsx          #   "Continue with Google" button
        ├── Verification.tsx    #   forgot-password email modal
        └── Reset.tsx           #   reset-password form
```

---

## Routing Map

| Route                          | Component          | Description                          |
| ------------------------------ | ------------------ | ------------------------------------ |
| `/`                            | `Login`            | Login page                           |
| `/signup`                      | `SignUp`           | Create an account                    |
| `/message`                     | `Message`          | "Check your inbox" (password reset)  |
| `/last-step`                   | `LastStep`         | "One last step" (post sign-up)       |
| `/page-layout`                 | `PageLayout`       | Authenticated dashboard shell        |
| `/page-layout` (index)         | `HomeContent`      | Upcoming / Past events               |
| `/page-layout/event`           | `Event`            | Upcoming events grid                 |
| `/page-layout/details/:id`     | `Details`          | Event details + services + checklist + program |
| `/page-layout/replan/:id`      | `Replan`           | Replan a past event                  |
| `/page-layout/services`        | `Services`         | Placeholder                          |
| `/page-layout/notifications`   | `Notifications`    | Placeholder                          |

The dashboard routes live as children of `PageLayout`, which renders the
sidebar and provides shared state (`step`, `showModal`, `setStep`,
`setShowModal`) to its outlet via `useOutletContext()`.

---

## Key Flows

### Event planning wizard

1. From the dashboard, click **Start planning** / **Plan a new event**.
2. `Upcoming` hosts a 4-step modal, stepping through `EventTitle` →
   `EventDate` → `EventLocation` → `EventServices`.
3. Each step saves partial data into shared state via `onSave`.
4. On submit, `handleData` POSTs the combined payload to
   `POST /events` and closes the modal.

### Event details (checklist & program)

- `Details` loads the event from `GET /events/:id`.
- Checklist items and program items are edited locally and persisted with
  `PATCH /events/:id` (payload `{ checklist }` or `{ program }`).
- `CheckModal` and `ProgramModal` handle adding new items.

### Vendor services marketplace

- The **Services** tab in `Details` renders `VendorMarketplace`.
- Vendors come from the static catalog in `src/data/vendors.ts` (30 vendors
  across 8 categories), not from json-server.
- Search and filters (price range, location, category, rating) are applied
  client-side with `useMemo`.
- Clicking a vendor card opens `VendorDetailModal` with an image gallery
  (supports multiple images with prev/next navigation), a details tab showing
  vendor info (name, rate, owner, location, description), and a notes tab
  where users can add, edit, and delete personal notes about the vendor.
- From the detail modal, users can **Add to Event** / **Remove from Event**
  or open `ContactModal` which displays call, email, and WhatsApp options.
- With `autoBookEventId` set (the details page), the vendor is booked directly
  to the current event; otherwise a modal prompts the user to pick an event.
- Booked vendors appear in the **Services** section on the Details tab
  (photo, name, rate, and owner).

### Replan a past event

- `PastEvents` lists events whose date is before today.
- Clicking one navigates to `/page-layout/replan/:id`.
- `Replan` pre-fills the wizard from `GET /events/:id` and saves changes with
  `PATCH /events/:id`, then returns to the Past events tab.

---

## Data Models

All interfaces live in `src/entities/`.

```ts
interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface EventData {
  id?: number;
  userId: number;
  title: string;
  date: Date | [Date, Date] | null;   // single day or range
  location: AreaData | null;
  services: ServiceData | null;
  bookedVendors?: BookedVendor[];
  checklist?: ChecklistItem[];
  program?: ProgramItem[];
}

interface AreaData {
  name: string;    // venue/hotel name
  town: string;
  city: string;
  region: string;
}

interface ServiceData {
  photo: boolean;
  entertainment: boolean;
  design: boolean;
  hiring: boolean;
  transport: boolean;
  event: boolean;
  foodServices: boolean;
  beautician: boolean;
}

interface Vendor {
  id: string;
  name: string;
  owner: string;
  category: string;   // matches a ServiceData key
  rate: number;       // price in GHS
  location: string;
  rating: number;
  image: string;
  images?: string[];  // additional images for gallery
  description: string;
}

interface BookedVendor {
  vendorId: string;
  name: string;
  owner: string;
  category: string;
  rate: number;
  location: string;
  rating: number;
  image: string;
  contacted?: boolean;
}

interface ChecklistItem { itemId: string; item: string; isDone: boolean; }
interface ProgramItem    { itemId: string; time: string; title: string; name: string; }
```

### json-server resources

| Endpoint            | Method | Purpose                                |
| ------------------- | ------ | -------------------------------------- |
| `/users`            | GET    | Fetch users (login verification)       |
| `/users`            | POST   | Create a user (sign up)                |
| `/users/:id`        | PUT    | Update a user (password reset)         |
| `/events`           | GET    | List all events                        |
| `/events`           | POST   | Create an event                        |
| `/events/:id`       | GET    | Fetch a single event                   |
| `/events/:id`       | PATCH  | Update checklist / program / bookedVendors / replan |

---

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check (`tsc -b`) then build     |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run ESLint over the project          |

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built app locally
```

---

## Notes & Current Limitations

- **No auth security**: login compares plain-text passwords against the
  json-server `users` file. This is a demo/mock setup, not production-ready.
- **API URLs are hard-coded** to `localhost:8000` and `localhost:9000`.
  Consider centralizing them in an env/config module.
- **Google sign-in is UI-only** (see `Button.tsx`) and is not connected to any
  provider.
- **Services (sidebar) and Notifications** pages are placeholders. The vendor
  marketplace is accessed through the **Services** tab on the event details
  page.
- Vendor data is static and lives in `src/data/vendors.ts` (placeholder
  images served from picsum.photos, Unsplash, and Wikimedia), not in json-server.
- Vendor notes in `VendorDetailModal` are stored locally in component state
  and are not persisted to the backend.
- `Reset.tsx` exists but is not registered in the router; it is reached from
  the verification flow and redirects to `/` after a successful reset.
- The location catalog (`src/hooks/locations.ts`) covers all 16 Ghanaian
  regions with sample hotel/venue data for each. The region dropdown in the
  event location wizard is dynamically generated from this catalog.
