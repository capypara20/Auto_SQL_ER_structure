# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SQL ER図ジェネレーター - A web application that automatically generates ER diagrams from SQL CREATE TABLE statements. Users upload SQL files and get interactive, customizable ER diagrams that can be exported as PNG, SVG, PDF, or Markdown.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Core Data Flow

1. **SQL Parsing** (`src/utils/sqlParser.ts`):
   - Parses CREATE TABLE statements using regex-based parser
   - Extracts table definitions, columns, primary keys, and foreign keys
   - Supports schema-qualified names, backticks, and various SQL syntax variations
   - Outputs: `Table[]` and `Relationship[]` objects

2. **Diagram Rendering** (`src/components/ERDiagram.tsx`):
   - Uses ReactFlow library for interactive node-edge graph
   - Converts `Table[]` to ReactFlow nodes with custom `TableNode` component
   - Converts `Relationship[]` to ReactFlow edges
   - Handles user interactions: drag, zoom, node/edge selection

3. **State Management** (`src/App.tsx`):
   - Main app state: `tables`, `relationships`, `style` (DiagramStyle)
   - UI state: `selectedTableForSQL`, `selectedTableForStyle`, `showStylePanel`
   - File upload handling with support for multiple .sql files
   - Export functionality orchestration
   - Sidebar visibility management

### Key Components

- **TableNode** (`src/components/TableNode.tsx`):
  - Custom ReactFlow node component
  - Renders table header and column list
  - Shows primary key (gold key icon) and foreign key (purple key icon) indicators
  - Styled with Tailwind CSS and dynamic inline styles from DiagramStyle
  - Click events propagate to parent for sidebar control

- **TableSQLSidebar** (`src/components/TableSQLSidebar.tsx`):
  - Left sidebar displayed on table double-click
  - Generates and displays SQL CREATE statement for the selected table
  - Integrated column editing functionality (type, nullable, key flags)
  - Copy-to-clipboard feature for SQL code
  - Detailed column information table with visual key indicators

- **RightSidebar** (`src/components/RightSidebar.tsx`):
  - Unified right sidebar with tab-based navigation
  - Two tabs:
    - **Table Style**: Individual table color customization (appears when table is clicked)
    - **Global Style**: Diagram-wide styling controls (always available)
  - Automatically switches to Table Style tab when a table is selected
  - Compact design to maximize diagram workspace

- **StylePanel** (`src/components/StylePanel.tsx`):
  - Compact component for global diagram styling (now embedded in RightSidebar)
  - Controls: background color, table colors, key colors, relationship line styles
  - Font settings: size, family, weight
  - Shape settings: border radius, border width
  - Edge settings: type, width, animation, dash patterns
  - Updates trigger re-render of all nodes/edges with new styles

- **TableStylePanel** (now part of `src/components/RightSidebar.tsx`):
  - Individual table color customization
  - Override default colors for specific tables
  - Header and body background/text colors
  - Reset to default button

### Type System

All core types defined in `src/types/index.ts`:
- `Table`: name + Column[]
- `Column`: name, type, isPrimaryKey, isForeignKey, isNullable, foreignKeyRef
- `Relationship`: source/target tables and columns
- `DiagramStyle`: comprehensive styling configuration
- `defaultStyle`: default color scheme and settings

### SQL Parser Implementation Details

The parser (`src/utils/sqlParser.ts`) handles:
- CREATE TABLE with optional IF NOT EXISTS
- Schema-qualified table names (schema.table)
- Backtick-quoted identifiers
- PRIMARY KEY at table level and column level
- FOREIGN KEY with REFERENCES clause
- CONSTRAINT named constraints
- Complex data types (TIMESTAMP WITH TIME ZONE, etc.)

**Important**: The parser processes table content line-by-line and applies PRIMARY KEY and FOREIGN KEY flags in a post-processing step to ensure all constraints are captured before marking columns.

### Export System

`src/utils/exportDiagram.ts` provides multiple export formats:
- **PNG/SVG/PDF**: Uses `html-to-image` library to capture ReactFlow viewport
  - Targets `.react-flow__viewport` element
  - Filters out controls, minimap, background elements
- **Markdown**: Generates table documentation with column details
- **Mermaid** (if implemented): Generates mermaid.js ER diagram syntax

## Sample Data

Sample SQL files in `public/examples/`:
- `sample.sql`: Blog system schema example
- Test with various SQL dialects to verify parser compatibility

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- ReactFlow (graph visualization library)
- Tailwind CSS (styling)
- lucide-react (icons)
- html-to-image (diagram export)
- jsPDF (PDF export)

## User Interaction Patterns

### Table Click Behavior
- **Single Click**: Opens right sidebar's "Table Style" tab for individual table color customization
- **Double Click**: Opens left sidebar (TableSQLSidebar) showing SQL definition and column editing

### Sidebar Management
- **Left Sidebar (TableSQLSidebar)**: Triggered by double-clicking a table
  - Displays generated SQL CREATE statement
  - Allows column editing (name, type, nullable, keys)
  - Includes copy-to-clipboard functionality

- **Right Sidebar (RightSidebar)**: Always present but tab-based
  - "Table Style" tab: Active when a table is selected (single click)
  - "Global Style" tab: Always available for diagram-wide styling
  - Tabs automatically switch based on user interaction

## Common Gotchas

1. **ReactFlow State Management**: When updating styles, nodes must be updated with new `data.style` object to trigger re-renders. See `ERDiagram.tsx` useEffect that watches `style` changes.

2. **SQL Parser Regex**: The parser uses greedy regex matching for table content `([\s\S]*?)`. Be careful when adding new parsing rules to avoid breaking existing functionality.

3. **Export Quality**: PNG/SVG exports use `pixelRatio` to control resolution. Higher values = better quality but slower generation.

4. **File Upload Reset**: The file input is reset after upload (`event.target.value = ''`) to allow re-uploading the same file.

5. **Relationship Property Names**: Use `source`/`target` (NOT `sourceTable`/`targetTable`) to match the Relationship type definition. The duplicate check in App.tsx relies on these exact property names.

6. **Sidebar State Separation**: Keep `selectedTableForSQL` and `selectedTableForStyle` as separate states - they control different sidebars and different user interactions (click vs double-click).

## Recent Updates (2025-12-24)

### UI/UX Refactoring
- Migrated from modal-based to sidebar-based UI for better workspace visibility
- Consolidated multiple panels into unified left/right sidebar architecture
- Separated concerns: structure editing (left) vs. styling (right)
- Improved navigation with clear click/double-click patterns
- Made StylePanel more compact to reduce screen real estate usage
