# Cyber Ocean Lead Pipeline - Technical & UI/UX Documentation

## 1. Project Overview

**Cyber Ocean Lead Pipeline** is a client-side CRM-style application designed for the e-learning division of a company named "Cyber Ocean." It functions as a sophisticated lead management and analytics tool, built entirely with React and TypeScript, and runs locally in the browser using `localStorage` for data persistence.

The application has been enhanced with a modern, elegant "glassmorphism" UI, fluid animations, and a comprehensive suite of advanced features to streamline the entire sales, payment, and data management lifecycle.

### Core Features:

*   **Lead Management**: Full CRUD (Create, Read, Update, Delete) functionality for sales leads.
*   **Multi-Pipeline Visualization**:
    *   **Leads Pipeline**: A Kanban-style, drag-and-drop board to track leads through sales stages.
    *   **Demo Pipeline**: An automated, time-based pipeline that tracks leads through a 3-day demo period.
    *   **Payments Pipeline**: A dedicated pipeline to manage post-sale payment installments.
*   **Conversion Funnel Visualization**: A dedicated view with a funnel chart to visually track lead progression, conversion rates between stages, and drop-off points.
*   **Advanced Payments Tracking**: For paid clients, the system tracks installments with due dates, allows document uploads for each installment and invoice, and supports different RIB types with conditional form logic.
*   **Integrated Document Viewer**: An inline modal viewer allows for the instant preview of uploaded documents (PDFs, images) without requiring downloads.
*   **Analytics Dashboard**: A comprehensive dashboard with key performance indicators (KPIs) and dynamic charts to visualize sales data, conversion funnels, and lead sources. Includes dynamic filtering for revenue by month and year.
*   **Context-Aware Alert System**: Proactive notifications for time-sensitive tasks (e.g., stale leads, demo expirations, payment follow-ups), with alerts tailored to the specific view (Pipeline, Demo, Payments, or Dashboard).
*   **Data Filtering & Search**: Robust filtering by lead stage, type, and source, along with a global search.
*   **Bulk Actions**: Ability to select multiple leads to change their stage, delete them, or export their data.
*   **Auto Backup & Import/Export System**:
    *   **Automatic Backups**: The system automatically creates a debounced backup of all data to `localStorage` after any change, storing the last 10 versions.
    *   **Manual Import/Export**: Manually export the entire database as a JSON file for safekeeping, and import a JSON backup to restore data.
    *   **CSV Export**: Export selected or all leads to a CSV file.
*   **Offline First**: Fully functional offline, with all data persisted in `localStorage`.

---

## 2. Technical Architecture

### 2.1. Frontend Stack

*   **Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (via CDN)
*   **Charting Library**: Recharts
*   **Module System**: ES Modules with `importmap` for dependency management (no build step).
*   **Utility Libraries**:
    *   `clsx`: For conditionally joining class names.
    *   `date-fns`: For robust date parsing and formatting.
    *   `react-phone-number-input`: For formatted, international phone number input.

### 2.2. Project Structure

The project follows a standard component-based architecture.

```
/
├── index.html                  # Main HTML entry point
├── index.tsx                   # Renders the React application
├── App.tsx                     # Root component, manages global state
├── metadata.json               # Project metadata
|
├── components/
│   ├── Header.tsx
│   ├── PipelineView.tsx
│   ├── PaymentsPipelineView.tsx
│   ├── DemoPipelineView.tsx
│   ├── DashboardView.tsx
│   ├── FunnelView.tsx
│   ├── LeadCard.tsx
│   ├── LeadModal.tsx
│   ├── Alerts.tsx
│   ├── DocumentViewer.tsx
│   └── charts/
│       ├── KpiCard.tsx
│       └── ... (chart components)
|
├── hooks/
│   └── useLeads.ts             # Manages lead data logic and localStorage
|
├── types.ts                    # Global TypeScript type definitions
└── constants.ts                # Application-wide constants
```

### 2.3. State Management

The application employs React's built-in hooks for state management. The primary state (leads, filters, current view, etc.) is centralized in the root `App.tsx` component.

*   **`useState`**: Manages view state, search terms, filters, modal visibility, and selected leads.
*   **`useMemo`**: Optimizes performance by memoizing expensive calculations, such as filtering leads and generating alerts.
*   **`useCallback`**: Memoizes handler functions passed down to child components to prevent unnecessary re-renders.

### 2.4. Data Persistence

*   **Primary Storage**: The browser's `localStorage` is used as the database, making the app fully functional offline.
*   **Primary Data Key**: `cyber-ocean-leads-v2` is the key used to store the current array of leads.
*   **Auto Backup System**: A separate key, `cyber-ocean-leads-backups-v1`, stores a rolling list of the last 10 backups. A new backup is automatically created (with a 2-second debounce) whenever the lead data changes.
*   **Mechanism**: The `useLeads` custom hook encapsulates all logic for interacting with `localStorage`, including CRUD operations and the backup/restore system.

---

## 3. UI/UX Design

### 3.1. General Design Philosophy

*   **Theme**: A sophisticated, modern dark-mode theme with a deep background, subtle radial gradients, and custom-styled scrollbars to create an immersive experience.
*   **Aesthetic**: "Glassmorphism" is used for key UI elements (header, cards, modals) to create a sense of depth and translucency.
*   **Interactivity**: Fluid animations, smooth transitions, and glowing visual feedback on interactive elements make the application feel responsive and polished.
*   **Accent Color**: **Cyan** is used as the primary accent color for buttons, highlights, and interactive states, creating a cohesive and professional look.
*   **Typography**: The **Inter** font family is used for its excellent readability.

### 3.2. Component-Level UI Details

#### Header (`Header.tsx`)
*   **Appearance**: A floating, translucent "glass" panel that remains fixed at the top of the viewport.
*   **Navigation**: A view switcher with icons and a glowing "pill" indicator that smoothly animates to the active view.
*   **Data Management**: Includes icon buttons for manual JSON import/export.

#### Pipeline Views & Funnel View
*   **Layout**: The three pipelines and the new Funnel View are the core data visualization areas.
*   **Columns & Funnel**: Pipeline columns and funnel stages are styled with semi-transparent backgrounds and color-coded headers for clarity.
*   **Drag-and-Drop**: Dragging a card in a pipeline highlights the target column with a prominent glow for clear feedback.

#### Lead Card (`LeadCard.tsx`)
*   **Appearance**: A "glassmorphism" card with a colored left border matching its stage. It features a "lift and glow" hover effect.
*   **Content**: A redesigned, icon-rich layout displays the lead's name, type, source, and date added for improved scannability.

#### Dashboard View (`DashboardView.tsx`)
*   **Layout**: A responsive grid featuring animated KPI cards and detailed charts.
*   **KPI Cards**: Visually engaging cards with gradient backgrounds, icons, and a glowing hover effect provide a quick overview of key metrics.
*   **Revenue Analytics**: A dedicated section allows users to dynamically view revenue for a selected month and year.

#### Lead Modal (`LeadModal.tsx`)
*   **Appearance**: A large "glassmorphism" modal for creating and editing leads.
*   **Dynamic Form**: The form is organized into logical `fieldset`s. It intelligently shows and hides fields based on the selected **Stage**, including the advanced **Payments Installments Tracking System**.
*   **Document Uploads**: Provides file inputs for installments and invoices, with a "View" button to open the `DocumentViewer`.

---

## 4. Data Model & Constants

### 4.1. Core Types (`types.ts`)

```typescript
// The main data structure for a single lead
export interface Lead {
    id: string;
    name: string;
    contact: string; // Phone / WhatsApp
    email?: string;
    type: ClientType;
    stage: PipelineStage;
    paymentStage?: PaymentStage;
    dateAdded: string; // ISO string
    demoStartDate?: string; // ISO string
    demoEndDate?: string; // ISO string
    paymentDate?: string; // ISO string
    notes?: string;
    source: string;
    reasonLostDelay?: ReasonLostOrDelay;
    recontactDate?: string; // ISO string
    // Payment tracking fields
    ribType?: RIBType;
    numberOfInstallments?: number;
    installments?: Installment[];
    numberOfInvoices?: number;
    invoices?: Invoice[];
}

// Interfaces for uploaded documents
export interface Installment {
    date: string; // YYYY-MM-DD
    documentName?: string;
    documentContent?: string; // Base64 Data URL for previewing
    documentMimeType?: string;
}
export interface Invoice {
    documentName?: string;
    documentContent?: string; // Base64 Data URL for previewing
    documentMimeType?: string;
}

// Other core types...
```

### 4.2. Constants (`constants.ts`)

*   **`PIPELINE_STAGES`**, **`PAYMENT_PIPELINE_STAGES`**, **`DEMO_PIPELINE_STAGES`**: Arrays defining the stages for each respective pipeline.
*   **`LEAD_SOURCES`**: A predefined array of strings for the lead source dropdown.
*   **`REASONS_LOST_DELAY`**: An array of strings for the reason dropdown.
*   **`STAGE_COLORS`**, **`PAYMENT_STAGE_COLORS`**, **`DEMO_STAGE_COLORS`**: Records mapping each stage to a specific color object, ensuring consistent color-coding.

---

## 5. How to Recreate This Project

1.  **Setup HTML**: Create `index.html`. Add `<div id="root">`. Use an `importmap` to define CDN URLs for `react`, `react-dom`, `recharts`, `recharts/funnel`, `clsx`, `date-fns`, and `react-phone-number-input`. Link to the Tailwind CSS CDN and Google Fonts (Inter).
2.  **Define Core Structures**: Create `types.ts` and `constants.ts` to establish the data model and shared constants.
3.  **Implement Data Logic**: Create the `useLeads` custom hook in `hooks/useLeads.ts`. Implement all CRUD operations, the `localStorage` logic, and the auto-backup/import/export functions.
4.  **Build the Root Component**: Create `App.tsx`. Initialize all top-level states, memoized calculations (`filteredLeads`, `alerts`), and handler functions.
5.  **Develop UI Components**:
    *   Start with atomic components like `KpiCard.tsx` and the redesigned `LeadCard.tsx`.
    *   Build the pipeline views: `PipelineView.tsx`, `PaymentsPipelineView.tsx`, and `DemoPipelineView.tsx`.
    *   Create the data visualization views: `DashboardView.tsx` (with its chart components) and `FunnelView.tsx`.
    *   Implement the `Header.tsx` with its conditional logic for the bulk action bar and view switching.
    *   Create the `LeadModal.tsx` with its complex, conditional form logic and document handling.
    *   Create the `DocumentViewer.tsx` modal for inline previews.
6.  **Style Components**: Use Tailwind CSS utility classes directly in the JSX. Add custom styles and animations to `index.html` as needed.
7.  **Final Assembly**: In `App.tsx`, conditionally render the main views based on the `currentView` state. Ensure all props and handlers are correctly passed down the component tree. Render `<App />` from `index.tsx`.
```