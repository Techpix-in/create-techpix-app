# Create Techpix App

## Design Document

### Architecture Philosophy

The tool follows an **opinionated-with-options** approach:
- **Mandatory stack**: Next.js 14+, TypeScript, Tailwind CSS, ESLint, Docker
- **Optional integrations**: API clients, validation, testing, utilities
- **Pre-configured ecosystem**: ShadCN UI, commit tools, development workflow

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CLI Parser    │───▶│  Config Builder  │───▶│ Template Engine │
│                 │    │                  │    │                 │
│ • Args parsing  │    │ • Merge configs  │    │ • File templates│
│ • Validation    │    │ • Apply defaults │    │ • Substitution  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Interactive     │    │   Dependency     │    │ Project         │
│ Prompter        │    │   Manager        │    │ Generator       │
│                 │    │                  │    │                 │
│ • User prompts  │    │ • Package mgmt   │    │ • File creation │
│ • Option select │    │ • Install deps   │    │ • Post-setup    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

#### 1. Configuration System

```typescript
interface TechpixConfig {
  // Mandatory (no prompts)
  projectName: string;
  typescript: true;
  tailwind: true;
  eslint: true;
  docker: true;
  shadcn: {
    components: ['button', 'badge', 'card'];
  };
  nextConfig: {
    output: 'standalone';
  };
  commitTools: {
    commitlint: true;
    lintStaged: true;
    husky: true;
  };
  
  // Optional (user-selectable)
  apiClient: 'axios' | 'react-query' | 'graphql' | null;
  validation: 'zod' | null;
  icons: 'react-icons' | null;
  testing: 'vitest' | null;
  customHooks: {
    useDataTable: boolean;
    useDebounce: boolean;
  };
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

interface TemplateContext {
  config: TechpixConfig;
  projectPath: string;
  dependencies: DependencyMap;
  devDependencies: DependencyMap;
  scripts: Record<string, string>;
  envVariables: Record<string, string>;
}
```

#### 2. Template System Architecture

```
templates/
├── base/                           # Core mandatory files
│   ├── next.config.js              # Standalone output config (plain copy)
│   ├── package.json.hbs            # Base deps – interpolated with project data
│   ├── tsconfig.json               # TypeScript config (plain copy)
│   ├── eslint.config.js            # ESLint rules (plain copy)
│   ├── commitlint.config.js        # for code hygiene rules (plain copy)
│   ├── Makefile                    # for running multi-env dockerfiles 
│   └── docker/                     # Docker dir for multi-env
│   |   ├── staging/
|   |   |   ├── compose.yaml
|   |   |   └── Dockerfile    
│   |   └── production/
|   |       ├── compose.yaml
|   |       └── Dockerfile   
|   ├── public/                     # public assets
│   └── src/                        # Next.js 15 app router structure
│       ├── app/
│       │   ├── auth/               # Authentication routes
│       │   ├── (main)/             # Main route group
│       │   │   ├── example_page/
│       │   │   │   ├── page.tsx    # nextjs server page
│       │   │       └── _components/
│       │   ├── layout.tsx          # Root layout
│       │   ├── page.tsx            # Home page
│       │   └── globals.css         # Global styles
│       ├── components/
│       │   └── ui/                 # Shadcn/ui components directory
│       |      ├── button.tsx                  # Button component with variants
│       |      ├── badge.tsx                   # Badge component for status indicators
│       |      ├── card.tsx                    # Card component for content containers
│       |      ├── checkbox.tsx                # Checkbox component for form inputs
│       |      ├── dialog.tsx                  # Modal dialog component
│       |      ├── label.tsx                   # Label component for form fields
│       |      ├── pagination.tsx              # Pagination component for data navigation
│       |      ├── radio-group.tsx             # Radio group component for form selections
│       |      ├── select.tsx                  # Select dropdown component
│       |      ├── slider.tsx                  # Slider component for range inputs
│       |      ├── switch.tsx                  # Toggle switch component
│       |      ├── textarea.tsx                # Textarea component for multi-line text
│       |      ├── table.tsx                   # Table component for data display
│       |      └── input.tsx                   # Input component for text fields
│       ├── config/
│       │   └── config.ts           # Configuration files for the project
│       ├── hooks/
│       │   └── example_hook.ts     # Custom hook 
│       ├── lib/
│       │   ├── utils.ts            # Utility functions
│       │   └── constants.ts        # MACROS, constants 
│       ├── types/
│       │   └── index.ts            # TypeScript types 
│       └── data/
│           └── mockData.ts         # Mock data for development
├── commit-tools/                   # Git hooks & commit tools
│   ├── commitlint.config.js        # Conventional commits rules
│   ├── lint-staged.config.js       # Lint-staged setup
│   └── husky/                      # Hook scripts
├── optional/                       # User-selectable features
│   ├── api-clients/
│   │   ├── axios-setup.ts          # Axios helper (mandatory)
│   │   ├── react-query-setup.ts    # React-Query helper
│   │   └── graphql-setup.ts        # Apollo/GraphQL helper
│   ├── validation/
│   │   └── zod-schemas.ts          # Zod example schemas
│   ├── testing/
│   │   └── vitest.config.ts        # Vitest config
│   └── hooks/
│       ├── use-data-table.ts       # TanStack Table hook (enhanced version)
│       └── use-debounce.ts         # Debounce utility
└── utils/                          # Reusable utility modules
    ├── constants.ts                # Project-wide constants
    ├── helpers.ts                  # Generic helpers
    └── types.ts                    # Shared TypeScript types
```

#### 3. Dependency Management Strategy

```typescript
const mandatoryDependencies = {
  // Core Next.js stack
  'next': '^14.0.0',
  'react': '^18.0.0',
  'react-dom': '^18.0.0',
  
  // UI & Styling (mandatory)
  'tailwindcss': '^3.4.0',
  'autoprefixer': '^10.4.0',
  'postcss': '^8.4.0',
  '@tailwindcss/forms': '^0.5.0',
  
  // ShadCN UI ecosystem
  'class-variance-authority': '^0.7.0',
  'clsx': '^2.0.0',
  'tailwind-merge': '^2.0.0',
  'lucide-react': '^0.263.0',
  
  // TypeScript (mandatory)
  'typescript': '^5.2.0',
  '@types/node': '^20.0.0',
  '@types/react': '^18.0.0',
  '@types/react-dom': '^18.0.0'
};

const mandatoryDevDependencies = {
  // Code quality (mandatory)
  'eslint': '^8.50.0',
  'eslint-config-next': '^14.0.0',
  '@typescript-eslint/eslint-plugin': '^6.0.0',
  '@typescript-eslint/parser': '^6.0.0',
  
  // Commit tools (mandatory)
  '@commitlint/cli': '^17.0.0',
  '@commitlint/config-conventional': '^17.0.0',
  'husky': '^8.0.0',
  'lint-staged': '^14.0.0'
};

const optionalDependencies = {
  'axios': {
    deps: ['axios'],
    devDeps: []
  },
  'react-query': {
    deps: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
    devDeps: []
  },
  'graphql': {
    deps: ['graphql', '@apollo/client'],
    devDeps: ['@graphql-codegen/cli', '@graphql-codegen/typescript']
  },
  'zod': {
    deps: ['zod'],
    devDeps: []
  },
  'react-icons': {
    deps: ['react-icons'],
    devDeps: []
  },
  'vitest': {
    deps: [],
    devDeps: ['vitest', '@vitejs/plugin-react', 'jsdom']
  }
};
```

### Key Design Decisions

#### 1. No Prompts for Core Stack
- **Rationale**: Enforces Techpix standards and reduces decision fatigue
- **Implementation**: Core technologies are automatically included
- **Benefits**: Consistent project structure, faster onboarding

#### 2. Cosmiconfig Integration
- **Purpose**: Flexible configuration file loading and management
- **Usage**: Load project-specific overrides and team configurations
- **Files supported**: `techpix.config.js`, `.techpixrc`, `package.json` field

#### 3. Docker-First Approach
- **Mandatory Dockerfile**: Every project includes production-ready containerization
- **Next.js standalone**: Optimized for containerized deployments
- **Multi-stage builds**: Development and production configurations

#### 4. Pre-configured Development Workflow
- **Husky hooks**: Automated pre-commit validation
- **Lint-staged**: Only lint changed files for performance
- **Commitlint**: Enforce conventional commit messages

### Error Handling & Recovery

#### 1. Validation Layers
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public suggestion?: string
  ) {
    super(message);
  }
}

const validationRules = {
  projectName: {
    pattern: /^[a-zA-Z0-9-_]+$/,
    message: 'Project name must contain only letters, numbers, hyphens, and underscores',
    suggestion: 'Try: my-techpix-app'
  },
  nodeVersion: {
    minimum: '18.0.0',
    message: 'Node.js 18+ required for Next.js 14 compatibility'
  }
};
```

#### 2. Rollback Strategy
```typescript
class ProjectRollback {
  private operations: RollbackOperation[] = [];
  
  trackOperation(operation: RollbackOperation) {
    this.operations.push(operation);
  }
  
  async rollback(): Promise<void> {
    for (const op of this.operations.reverse()) {
      await op.undo();
    }
  }
}
```

### Performance Considerations

#### 1. Template Pre-compilation
- Bundle templates at build time to reduce runtime processing
- Use efficient template engine (Handlebars) with caching
- Lazy load optional templates only when needed

#### 2. Parallel Operations
- Concurrent file creation for independent templates
- Parallel package installation where possible
- Background dependency resolution

#### 3. Smart Caching
- Cache user preferences for subsequent runs
- Store successful configurations as defaults
- Cache package metadata to reduce network calls

***
