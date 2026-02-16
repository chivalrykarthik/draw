export type DiagramType = 'flow' | 'sequence' | 'architecture';

export interface DiagramTemplate {
  id: string;
  name: string;
  type: DiagramType;
  description: string;
  code: string;
}

export const DIAGRAM_TYPE_META: Record<DiagramType, { label: string; icon: string; color: string }> = {
  flow: { label: 'Flow Diagram', icon: '🔀', color: 'text-accent-cyan' },
  sequence: { label: 'Sequence Diagram', icon: '🔄', color: 'text-accent-emerald' },
  architecture: { label: 'Architecture Diagram', icon: '🏗️', color: 'text-accent-amber' },
};

export const templates: DiagramTemplate[] = [
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    type: 'architecture',
    description: 'A complex microservices system with API gateway, service mesh, and data stores',
    code: `# Microservices Architecture
direction: right

title: {
  label: Microservices Architecture
  near: top-center
  shape: text
  style.font-size: 28
  style.bold: true
}

clients: {
  label: Clients
  style.fill: "#1e293b"
  style.stroke: "#6366f1"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  web: {
    label: Web App
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  mobile: {
    label: Mobile App
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  third_party: {
    label: 3rd Party
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
}

gateway: {
  label: API Gateway
  shape: hexagon
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
  style.font-size: 16
}

auth: {
  label: Auth Service
  shape: rectangle
  style.fill: "#7c3aed"
  style.stroke: "#a78bfa"
  style.font-color: "#ffffff"
}

services: {
  label: Service Mesh
  style.fill: "#0f172a"
  style.stroke: "#22d3ee"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  user_svc: {
    label: User Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  order_svc: {
    label: Order Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  product_svc: {
    label: Product Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  payment_svc: {
    label: Payment Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  notification_svc: {
    label: Notification Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  analytics_svc: {
    label: Analytics Service
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
}

messaging: {
  label: Message Bus
  style.fill: "#1e293b"
  style.stroke: "#fbbf24"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  kafka: {
    label: Apache Kafka
    shape: queue
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
  redis_pub: {
    label: Redis Pub/Sub
    shape: queue
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
}

datastores: {
  label: Data Layer
  style.fill: "#1e293b"
  style.stroke: "#34d399"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  postgres: {
    label: PostgreSQL
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  mongo: {
    label: MongoDB
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  redis_cache: {
    label: Redis Cache
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  elasticsearch: {
    label: Elasticsearch
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
}

monitoring: {
  label: Observability
  style.fill: "#1e293b"
  style.stroke: "#fb7185"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  prometheus: {
    label: Prometheus
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  grafana: {
    label: Grafana
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  jaeger: {
    label: Jaeger Tracing
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
}

# Connections
clients.web -> gateway: HTTPS
clients.mobile -> gateway: HTTPS
clients.third_party -> gateway: REST API

gateway -> auth: Validate Token
gateway -> services.user_svc: /api/users
gateway -> services.order_svc: /api/orders
gateway -> services.product_svc: /api/products

services.order_svc -> services.payment_svc: Process Payment
services.order_svc -> messaging.kafka: Order Events
services.payment_svc -> messaging.kafka: Payment Events

messaging.kafka -> services.notification_svc: Consume Events
messaging.kafka -> services.analytics_svc: Consume Events
messaging.redis_pub -> services.notification_svc: Real-time

services.user_svc -> datastores.postgres: Read/Write
services.order_svc -> datastores.postgres: Read/Write
services.product_svc -> datastores.mongo: Read/Write
services.payment_svc -> datastores.postgres: Read/Write
services.analytics_svc -> datastores.elasticsearch: Index

services.user_svc -> datastores.redis_cache: Cache
services.product_svc -> datastores.redis_cache: Cache

services -> monitoring.prometheus: Metrics {style.stroke-dash: 3}
monitoring.prometheus -> monitoring.grafana: Visualize {style.stroke-dash: 3}
services -> monitoring.jaeger: Traces {style.stroke-dash: 3}
`,
  },
  {
    id: 'auth-flow',
    name: 'Auth Flow (Sequence)',
    type: 'sequence',
    description: 'A detailed OAuth 2.0 authentication flow with token refresh',
    code: `# OAuth 2.0 Authentication Flow
shape: sequence_diagram

user: {
  label: User
  shape: person
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
}
browser: {
  label: Browser
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}
api_gw: {
  label: API Gateway
  style.fill: "#1e293b"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}
auth_server: {
  label: Auth Server
  style.fill: "#7c3aed"
  style.stroke: "#a78bfa"
  style.font-color: "#ffffff"
}
user_db: {
  label: User DB
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}
resource_api: {
  label: Resource API
  style.fill: "#1e293b"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

# Login Flow
user -> browser: Click Sign In
browser -> auth_server: GET /authorize
auth_server -> browser: Return login page
browser -> user: Show login form
user -> browser: Enter credentials
browser -> auth_server: POST /login
auth_server -> user_db: Validate credentials
user_db -> auth_server: User verified
auth_server -> browser: Redirect with auth code

# Token Exchange
browser -> auth_server: POST /token with code
auth_server -> auth_server: Validate and generate tokens
auth_server -> browser: Return access and refresh tokens
browser -> browser: Store tokens in cookies

# Authenticated Request
user -> browser: Request protected resource
browser -> api_gw: GET /api/data with token
api_gw -> auth_server: Validate JWT
auth_server -> api_gw: Token valid
api_gw -> resource_api: Forward request
resource_api -> api_gw: Return data
api_gw -> browser: 200 OK
browser -> user: Display data

# Token Refresh
browser -> browser: Token expired
browser -> auth_server: Request token refresh
auth_server -> auth_server: Validate refresh token
auth_server -> browser: New tokens issued
`,
  },
  {
    id: 'logic-flowchart',
    name: 'Logic Flowchart',
    type: 'flow',
    description: 'A decision-tree style logic flowchart for error handling',
    code: `# Error Handling Logic Flowchart
direction: down

title: {
  label: Error Handling Decision Flow
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

start: {
  label: Request Received
  shape: oval
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
}

validate: {
  label: Validate Input
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

is_valid: {
  label: Input Valid?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

auth_check: {
  label: Check Authentication
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

is_auth: {
  label: Authenticated?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

rate_check: {
  label: Check Rate Limit
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

is_rate_ok: {
  label: Within Limit?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

process: {
  label: Process Request
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

is_success: {
  label: Success?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

cache_result: {
  label: Cache Result
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

return_200: {
  label: Return 200 OK
  shape: oval
  style.fill: "#065f46"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

return_400: {
  label: Return 400 Bad Request
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

return_401: {
  label: Return 401 Unauthorized
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

return_429: {
  label: Return 429 Too Many
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

retry: {
  label: Retry? (attempts < 3)
  shape: diamond
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

log_error: {
  label: Log Error
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

return_500: {
  label: Return 500 Server Error
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

# Flow connections
start -> validate
validate -> is_valid

is_valid -> auth_check: Yes {
  style.stroke: "#34d399"
}
is_valid -> return_400: No {
  style.stroke: "#fb7185"
}

auth_check -> is_auth
is_auth -> rate_check: Yes {
  style.stroke: "#34d399"
}
is_auth -> return_401: No {
  style.stroke: "#fb7185"
}

rate_check -> is_rate_ok
is_rate_ok -> process: Yes {
  style.stroke: "#34d399"
}
is_rate_ok -> return_429: No {
  style.stroke: "#fb7185"
}

process -> is_success
is_success -> cache_result: Yes {
  style.stroke: "#34d399"
}
is_success -> retry: No {
  style.stroke: "#fbbf24"
}

cache_result -> return_200

retry -> process: Yes {
  style.stroke: "#fbbf24"
}
retry -> log_error: No {
  style.stroke: "#fb7185"
}
log_error -> return_500
`,
  },
  {
    id: 'shapes-styles',
    name: 'Shapes & Styles',
    type: 'flow',
    description: 'Showcase of shapes, tooltips, links, and styling options',
    code: `# Shapes & Styles
direction: right

styled_box: {
  label: Styled Box
  tooltip: I have a tooltip!
  link: https://d2lang.com
  style: {
    fill: "#f472b6"
    stroke: "#831843"
    stroke-width: 4
    shadow: true
    border-radius: 8
    font-size: 16
  }
}

shapes: {
  style: {
      fill: transparent
      stroke: transparent
  }
  
  rect: { shape: rectangle }
  sq: { shape: square }
  page: { shape: page }
  para: { shape: parallelogram }
  doc: { shape: document }
  cyl: { shape: cylinder }
  q: { shape: queue }
  pkg: { shape: package }
  step: { shape: step }
  call: { shape: callout }
  actor: { shape: person }
  dia: { shape: diamond }
  oval: { shape: oval }
  circ: { shape: circle }
  hex: { shape: hexagon }
  cloud: { shape: cloud }
}

styled_box -> shapes.rect: Solid Arrow
styled_box -> shapes.sq: Dashed {style.stroke-dash: 3}
styled_box -> shapes.page: Colored {style.stroke: "#22d3ee"}
`,
  },
  {
    id: 'uml-class',
    name: 'UML Class Diagram',
    type: 'architecture',
    description: 'UML Class diagram with fields, methods, inheritance, and cardinality',
    code: `# UML Class Diagram
direction: right

User: {
  shape: class
  # Fields
  +id: UUID
  +email: String
  -password_hash: String
  
  # Methods
  +login(): void
  +register(): void
}

Post: {
  shape: class
  +id: UUID
  +title: String
  +content: Text
  +authorId: UUID
  
  +publish(): void
}

# Inheritance
Admin -> User: inherits

# Relationships
User -> Post: 1..* (creates)
`,
  },
  {
    id: 'er-diagram',
    name: 'ER Diagram',
    type: 'architecture',
    description: 'Entity Relationship diagram with sql_table shape, types, and constraints',
    code: `# ER Diagram
direction: right

users: {
  shape: sql_table
  id: int {constraint: primary_key}
  username: varchar(50)
  email: varchar(100) {constraint: unique}
  created_at: timestamp
}

orders: {
  shape: sql_table
  id: int {constraint: primary_key}
  user_id: int {constraint: foreign_key}
  total: decimal(10, 2)
  status: varchar(20)
}

# Relationships
users -> orders: has many
`,
  },
  {
    id: 'aws-architecture',
    name: 'AWS Architecture',
    type: 'architecture',
    description: 'Cloud architecture using nested containers and style customizations',
    code: `# AWS Architecture
direction: right

internet: {
  shape: cloud
}

vpc: {
  label: VPC
  style: {
      stroke: "#fbbf24"
      fill: transparent
      stroke-dash: 3
  }
  
  lb: {
    label: Load Balancer
    shape: rectangle
    style.fill: "#1e293b"
  }
  
  app_cluster: {
    label: App Cluster
    style.fill: transparent
    
    server1: { shape: square; style.fill: "#1e293b" }
    server2: { shape: square; style.fill: "#1e293b" }
  }
  
  db: {
    label: RDS Primary
    shape: cylinder
    style.fill: "#1e293b"
  }
}

internet -> vpc.lb: HTTPS
vpc.lb -> vpc.app_cluster: Traffic
vpc.app_cluster -> vpc.db: SQL
`,
  },
];

export const DEFAULT_CODE = `# Welcome to D2 Draw
# Use direction to control flow: right, left, up, down
direction: right

# You can control size with width and height
client: {
  label: Client App
  shape: rectangle
  width: 160
  height: 70
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
  style.font-size: 14
}

server: {
  label: API Server
  shape: rectangle
  width: 160
  height: 70
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
  style.font-size: 14
}

database: {
  label: Database
  shape: cylinder
  width: 140
  height: 80
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
  style.font-size: 14
}

cache: {
  label: Redis Cache
  shape: cylinder
  width: 140
  height: 80
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
  style.font-size: 14
}

client -> server: HTTP Request
server -> database: Query
server -> cache: Cache Check
database -> server: Result
server -> client: JSON Response
`;
