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
   - File upload handling with support for multiple .sql files
   - Export functionality orchestration

### Key Components

- **TableNode** (`src/components/TableNode.tsx`):
  - Custom ReactFlow node component
  - Renders table header and column list
  - Shows primary key (gold key icon) and foreign key (purple key icon) indicators
  - Styled with Tailwind CSS and dynamic inline styles from DiagramStyle

- **StylePanel** (`src/components/StylePanel.tsx`):
  - Right sidebar for customizing diagram appearance
  - Controls: colors, fonts, border styles, edge types, animation
  - Updates trigger re-render of all nodes/edges with new styles

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

## Common Gotchas

1. **ReactFlow State Management**: When updating styles, nodes must be updated with new `data.style` object to trigger re-renders. See `ERDiagram.tsx` useEffect that watches `style` changes.

2. **SQL Parser Regex**: The parser uses greedy regex matching for table content `([\s\S]*?)`. Be careful when adding new parsing rules to avoid breaking existing functionality.

3. **Export Quality**: PNG/SVG exports use `pixelRatio` to control resolution. Higher values = better quality but slower generation.

4. **File Upload Reset**: The file input is reset after upload (`event.target.value = ''`) to allow re-uploading the same file.
