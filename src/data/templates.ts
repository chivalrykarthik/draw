import type { DiagramType, DiagramTemplate, DiagramTypeMeta } from '../types';

export const DIAGRAM_TYPE_META: Record<DiagramType, DiagramTypeMeta> = {
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
  {
    id: 'git-branching',
    name: 'Git Branching Strategy',
    type: 'flow',
    description: 'GitFlow branching model with main, develop, feature, release, and hotfix branches',
    code: `# Git Branching Strategy (GitFlow)
direction: right

title: {
  label: GitFlow Branching Strategy
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

main_branch: {
  label: main
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
  style.border-radius: 8

  v1_0: {
    label: v1.0.0
    shape: hexagon
    style.fill: "#065f46"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  v1_1: {
    label: v1.1.0
    shape: hexagon
    style.fill: "#065f46"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  v1_1_1: {
    label: v1.1.1
    shape: hexagon
    style.fill: "#065f46"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
}

develop: {
  label: develop
  style.fill: "#1e293b"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
  style.border-radius: 8

  d_commit1: {
    label: Initial Setup
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  d_commit2: {
    label: Merge Features
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  d_commit3: {
    label: Post-Release
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
}

feature: {
  label: feature/*
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
  style.border-radius: 8

  feat_auth: {
    label: feature/auth
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  feat_api: {
    label: feature/api
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  feat_ui: {
    label: feature/dashboard
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
}

release: {
  label: release/1.1.0
  style.fill: "#1e293b"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
  style.border-radius: 8

  rc1: {
    label: RC1 - QA Testing
    shape: rectangle
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
  rc2: {
    label: RC2 - Bug Fixes
    shape: rectangle
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
}

hotfix: {
  label: hotfix/1.1.1
  style.fill: "#1e293b"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
  style.border-radius: 8

  fix: {
    label: Critical Bug Fix
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
}

# Flow
develop.d_commit1 -> feature.feat_auth: branch off {style.stroke: "#22d3ee"}
develop.d_commit1 -> feature.feat_api: branch off {style.stroke: "#22d3ee"}
develop.d_commit1 -> feature.feat_ui: branch off {style.stroke: "#22d3ee"}

feature.feat_auth -> develop.d_commit2: merge PR {style.stroke: "#818cf8"}
feature.feat_api -> develop.d_commit2: merge PR {style.stroke: "#818cf8"}
feature.feat_ui -> develop.d_commit2: merge PR {style.stroke: "#818cf8"}

develop.d_commit2 -> release.rc1: cut release {style.stroke: "#fbbf24"}
release.rc1 -> release.rc2: fix bugs
release.rc2 -> main_branch.v1_1: tag & merge {style.stroke: "#34d399"}
release.rc2 -> develop.d_commit3: back-merge {style.stroke: "#818cf8"; style.stroke-dash: 3}

main_branch.v1_0 -> main_branch.v1_1
main_branch.v1_1 -> hotfix.fix: urgent! {style.stroke: "#fb7185"}
hotfix.fix -> main_branch.v1_1_1: patch release {style.stroke: "#34d399"}
hotfix.fix -> develop.d_commit3: back-merge {style.stroke: "#818cf8"; style.stroke-dash: 3}`,
  },
  {
    id: 'cicd-pipeline',
    name: 'CI/CD Pipeline',
    type: 'flow',
    description: 'End-to-end CI/CD pipeline with build, test, scan, staging, and production deploy stages',
    code: `# CI/CD Pipeline
direction: right

title: {
  label: CI/CD Pipeline
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

trigger: {
  label: Git Push / PR
  shape: oval
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
}

build: {
  label: Build Stage
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#e2e8f0"
  style.border-radius: 8

  install: {
    label: Install Deps
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  compile: {
    label: Compile / Bundle
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  docker: {
    label: Build Docker Image
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
}

test: {
  label: Test Stage
  style.fill: "#1e293b"
  style.stroke: "#818cf8"
  style.font-color: "#e2e8f0"
  style.border-radius: 8

  unit: {
    label: Unit Tests
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  integration: {
    label: Integration Tests
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
  e2e: {
    label: E2E Tests
    shape: rectangle
    style.fill: "#312e81"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
  }
}

security: {
  label: Security Scan
  style.fill: "#1e293b"
  style.stroke: "#fb7185"
  style.font-color: "#e2e8f0"
  style.border-radius: 8

  sast: {
    label: SAST (SonarQube)
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  dep_scan: {
    label: Dependency Audit
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  image_scan: {
    label: Image Scan (Trivy)
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
}

staging: {
  label: Deploy Staging
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
  style.font-size: 14
}

approval: {
  label: Manual Approval
  shape: diamond
  style.fill: "#7c3aed"
  style.stroke: "#a78bfa"
  style.font-color: "#ffffff"
}

production: {
  label: Deploy Production
  shape: rectangle
  style.fill: "#065f46"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
  style.font-size: 14
}

monitor: {
  label: Health Check & Monitor
  shape: oval
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

rollback: {
  label: Rollback
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

# Pipeline flow
trigger -> build.install
build.install -> build.compile
build.compile -> build.docker

build.docker -> test.unit
test.unit -> test.integration
test.integration -> test.e2e

test.e2e -> security.sast
security.sast -> security.dep_scan
security.dep_scan -> security.image_scan

security.image_scan -> staging: deploy
staging -> approval: ready?

approval -> production: approved {style.stroke: "#34d399"}
approval -> rollback: rejected {style.stroke: "#fb7185"}

production -> monitor
monitor -> rollback: unhealthy {style.stroke: "#fb7185"; style.stroke-dash: 3}`,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Architecture',
    type: 'architecture',
    description: 'K8s cluster with ingress, services, deployments, pods, and persistent storage',
    code: `# Kubernetes Architecture
direction: right

title: {
  label: Kubernetes Cluster Architecture
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

internet: {
  label: Internet
  shape: cloud
  style.fill: "#1e293b"
  style.stroke: "#94a3b8"
  style.font-color: "#e2e8f0"
}

ingress: {
  label: Nginx Ingress Controller
  shape: hexagon
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
  style.font-size: 14
}

cluster: {
  label: K8s Cluster
  style.fill: "#0f172a"
  style.stroke: "#6366f1"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  ns_app: {
    label: Namespace: production
    style.fill: "#1e293b"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
    style.border-radius: 8

    frontend_svc: {
      label: frontend-svc (ClusterIP)
      shape: rectangle
      style.fill: "#164e63"
      style.stroke: "#22d3ee"
      style.font-color: "#cffafe"
    }
    frontend_deploy: {
      label: frontend (3 replicas)
      style.fill: "#0c4a6e"
      style.stroke: "#38bdf8"
      style.font-color: "#bae6fd"
      style.border-radius: 6

      pod1: { label: Pod 1; shape: rectangle; style.fill: "#164e63"; style.stroke: "#22d3ee"; style.font-color: "#cffafe" }
      pod2: { label: Pod 2; shape: rectangle; style.fill: "#164e63"; style.stroke: "#22d3ee"; style.font-color: "#cffafe" }
      pod3: { label: Pod 3; shape: rectangle; style.fill: "#164e63"; style.stroke: "#22d3ee"; style.font-color: "#cffafe" }
    }

    api_svc: {
      label: api-svc (ClusterIP)
      shape: rectangle
      style.fill: "#312e81"
      style.stroke: "#818cf8"
      style.font-color: "#e0e7ff"
    }
    api_deploy: {
      label: api-server (2 replicas)
      style.fill: "#1e1b4b"
      style.stroke: "#818cf8"
      style.font-color: "#c7d2fe"
      style.border-radius: 6

      api_pod1: { label: Pod 1; shape: rectangle; style.fill: "#312e81"; style.stroke: "#818cf8"; style.font-color: "#e0e7ff" }
      api_pod2: { label: Pod 2; shape: rectangle; style.fill: "#312e81"; style.stroke: "#818cf8"; style.font-color: "#e0e7ff" }
    }
  }

  ns_data: {
    label: Namespace: data
    style.fill: "#1e293b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
    style.border-radius: 8

    postgres_ss: {
      label: postgres (StatefulSet)
      shape: cylinder
      style.fill: "#064e3b"
      style.stroke: "#34d399"
      style.font-color: "#d1fae5"
    }
    redis_ss: {
      label: redis (StatefulSet)
      shape: cylinder
      style.fill: "#78350f"
      style.stroke: "#fbbf24"
      style.font-color: "#fef3c7"
    }
    pvc: {
      label: PersistentVolumeClaim
      shape: document
      style.fill: "#1e293b"
      style.stroke: "#94a3b8"
      style.font-color: "#e2e8f0"
    }
  }

  config: {
    label: Cluster Config
    style.fill: "#1e293b"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
    style.border-radius: 8

    configmap: { label: ConfigMap; shape: document; style.fill: "#78350f"; style.stroke: "#fbbf24"; style.font-color: "#fef3c7" }
    secret: { label: Secrets; shape: document; style.fill: "#78350f"; style.stroke: "#fbbf24"; style.font-color: "#fef3c7" }
    hpa: { label: HPA (Autoscaler); shape: rectangle; style.fill: "#78350f"; style.stroke: "#fbbf24"; style.font-color: "#fef3c7" }
  }
}

# Connections
internet -> ingress: HTTPS
ingress -> cluster.ns_app.frontend_svc: /
ingress -> cluster.ns_app.api_svc: /api/*

cluster.ns_app.frontend_svc -> cluster.ns_app.frontend_deploy
cluster.ns_app.api_svc -> cluster.ns_app.api_deploy
cluster.ns_app.api_deploy -> cluster.ns_data.postgres_ss: SQL
cluster.ns_app.api_deploy -> cluster.ns_data.redis_ss: Cache
cluster.ns_data.postgres_ss -> cluster.ns_data.pvc: mount
cluster.config.configmap -> cluster.ns_app.api_deploy: env vars {style.stroke-dash: 3}
cluster.config.secret -> cluster.ns_app.api_deploy: credentials {style.stroke-dash: 3}
cluster.config.hpa -> cluster.ns_app.api_deploy: scale {style.stroke-dash: 3}`,
  },
  {
    id: 'event-driven',
    name: 'Event-Driven (CQRS)',
    type: 'architecture',
    description: 'Event-driven architecture with CQRS pattern, event store, projections, and saga orchestration',
    code: `# Event-Driven Architecture (CQRS)
direction: right

title: {
  label: Event-Driven Architecture with CQRS
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

client: {
  label: Client App
  shape: rectangle
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

api_gw: {
  label: API Gateway
  shape: hexagon
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
  style.font-size: 14
}

command_side: {
  label: Command Side (Write)
  style.fill: "#1e293b"
  style.stroke: "#fb7185"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  cmd_handler: {
    label: Command Handler
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  aggregate: {
    label: Domain Aggregate
    shape: rectangle
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
  event_store: {
    label: Event Store
    shape: cylinder
    style.fill: "#4c0519"
    style.stroke: "#fb7185"
    style.font-color: "#ffe4e6"
  }
}

event_bus: {
  label: Event Bus (Kafka)
  shape: queue
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
  style.font-size: 14
}

query_side: {
  label: Query Side (Read)
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  projector: {
    label: Event Projector
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  read_model: {
    label: Read Model (Materialized View)
    shape: cylinder
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
  query_handler: {
    label: Query Handler
    shape: rectangle
    style.fill: "#164e63"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
  }
}

saga: {
  label: Saga Orchestrator
  style.fill: "#1e293b"
  style.stroke: "#a78bfa"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  saga_handler: {
    label: Saga Process Manager
    shape: rectangle
    style.fill: "#4c1d95"
    style.stroke: "#a78bfa"
    style.font-color: "#ede9fe"
  }
  compensation: {
    label: Compensation Logic
    shape: rectangle
    style.fill: "#4c1d95"
    style.stroke: "#a78bfa"
    style.font-color: "#ede9fe"
  }
}

notifications: {
  label: Notification Service
  shape: rectangle
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

# Command Flow
client -> api_gw: Commands (POST/PUT/DELETE)
api_gw -> command_side.cmd_handler: Dispatch Command
command_side.cmd_handler -> command_side.aggregate: Validate & Apply
command_side.aggregate -> command_side.event_store: Persist Events
command_side.event_store -> event_bus: Publish Events

# Query Flow
client -> api_gw: Queries (GET)
api_gw -> query_side.query_handler: Dispatch Query
query_side.query_handler -> query_side.read_model: Fetch

# Event Processing
event_bus -> query_side.projector: Consume Events
query_side.projector -> query_side.read_model: Update Projections

# Saga
event_bus -> saga.saga_handler: Orchestrate
saga.saga_handler -> command_side.cmd_handler: Compensating Commands {style.stroke-dash: 3}
saga.saga_handler -> saga.compensation: On Failure {style.stroke: "#fb7185"}

# Side Effects
event_bus -> notifications: Send Notifications`,
  },
  {
    id: 'state-machine',
    name: 'Order State Machine',
    type: 'flow',
    description: 'Order lifecycle state machine showing all transitions, cancellations, and refund paths',
    code: `# Order Lifecycle State Machine
direction: right

title: {
  label: Order State Machine
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

created: {
  label: ORDER CREATED
  shape: oval
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
}

pending_payment: {
  label: PENDING PAYMENT
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

payment_failed: {
  label: PAYMENT FAILED
  shape: rectangle
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

confirmed: {
  label: CONFIRMED
  shape: rectangle
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

processing: {
  label: PROCESSING
  shape: rectangle
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

shipped: {
  label: SHIPPED
  shape: rectangle
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

out_for_delivery: {
  label: OUT FOR DELIVERY
  shape: rectangle
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

delivered: {
  label: DELIVERED
  shape: oval
  style.fill: "#065f46"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

cancelled: {
  label: CANCELLED
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

return_requested: {
  label: RETURN REQUESTED
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

returned: {
  label: RETURNED
  shape: rectangle
  style.fill: "#4c1d95"
  style.stroke: "#a78bfa"
  style.font-color: "#ede9fe"
}

refunded: {
  label: REFUNDED
  shape: oval
  style.fill: "#4c1d95"
  style.stroke: "#a78bfa"
  style.font-color: "#ede9fe"
}

# Happy path
created -> pending_payment: submit order
pending_payment -> confirmed: payment success {style.stroke: "#34d399"}
confirmed -> processing: begin fulfillment
processing -> shipped: carrier pickup
shipped -> out_for_delivery: last mile
out_for_delivery -> delivered: customer received {style.stroke: "#34d399"}

# Payment failure
pending_payment -> payment_failed: payment declined {style.stroke: "#fb7185"}
payment_failed -> pending_payment: retry payment {style.stroke: "#fbbf24"; style.stroke-dash: 3}
payment_failed -> cancelled: max retries {style.stroke: "#fb7185"}

# Cancellation paths
pending_payment -> cancelled: user cancels {style.stroke: "#fb7185"}
confirmed -> cancelled: user cancels (before ship) {style.stroke: "#fb7185"}

# Return & refund
delivered -> return_requested: request return
return_requested -> returned: package received
returned -> refunded: refund issued {style.stroke: "#a78bfa"}`,
  },
  {
    id: 'network-topology',
    name: 'Network Topology',
    type: 'architecture',
    description: 'Enterprise network architecture with DMZ, firewalls, load balancers, and internal zones',
    code: `# Enterprise Network Topology
direction: right

title: {
  label: Enterprise Network Architecture
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

internet: {
  label: Internet
  shape: cloud
  style.fill: "#1e293b"
  style.stroke: "#94a3b8"
  style.font-color: "#e2e8f0"
}

edge_fw: {
  label: Edge Firewall
  shape: hexagon
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
  style.font-size: 14
}

dmz: {
  label: DMZ (Demilitarized Zone)
  style.fill: "#1e293b"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
  style.border-radius: 12

  waf: {
    label: WAF
    shape: hexagon
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
  lb: {
    label: Load Balancer (L7)
    shape: rectangle
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
  reverse_proxy: {
    label: Reverse Proxy (Nginx)
    shape: rectangle
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
}

internal_fw: {
  label: Internal Firewall
  shape: hexagon
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
  style.font-size: 14
}

app_zone: {
  label: Application Zone
  style.fill: "#0f172a"
  style.stroke: "#818cf8"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  web_servers: {
    label: Web Servers
    style.fill: "#1e293b"
    style.stroke: "#22d3ee"
    style.font-color: "#cffafe"
    style.border-radius: 6
    ws1: { label: Web 1; shape: rectangle; style.fill: "#164e63"; style.stroke: "#22d3ee"; style.font-color: "#cffafe" }
    ws2: { label: Web 2; shape: rectangle; style.fill: "#164e63"; style.stroke: "#22d3ee"; style.font-color: "#cffafe" }
  }

  app_servers: {
    label: App Servers
    style.fill: "#1e293b"
    style.stroke: "#818cf8"
    style.font-color: "#e0e7ff"
    style.border-radius: 6
    as1: { label: App 1; shape: rectangle; style.fill: "#312e81"; style.stroke: "#818cf8"; style.font-color: "#e0e7ff" }
    as2: { label: App 2; shape: rectangle; style.fill: "#312e81"; style.stroke: "#818cf8"; style.font-color: "#e0e7ff" }
  }

  mq: {
    label: Message Queue
    shape: queue
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
}

data_zone: {
  label: Data Zone
  style.fill: "#0f172a"
  style.stroke: "#34d399"
  style.font-color: "#e2e8f0"
  style.border-radius: 12

  primary_db: {
    label: Primary DB
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  replica_db: {
    label: Read Replica
    shape: cylinder
    style.fill: "#064e3b"
    style.stroke: "#34d399"
    style.font-color: "#d1fae5"
  }
  cache: {
    label: Redis Cluster
    shape: cylinder
    style.fill: "#78350f"
    style.stroke: "#fbbf24"
    style.font-color: "#fef3c7"
  }
}

# Flow
internet -> edge_fw: Inbound Traffic
edge_fw -> dmz.waf: Filtered
dmz.waf -> dmz.lb: Clean Traffic
dmz.lb -> dmz.reverse_proxy: Route

dmz.reverse_proxy -> internal_fw: Forward
internal_fw -> app_zone.web_servers: HTTP

app_zone.web_servers -> app_zone.app_servers: API Calls
app_zone.app_servers -> app_zone.mq: Async Tasks
app_zone.app_servers -> data_zone.primary_db: Write
app_zone.app_servers -> data_zone.replica_db: Read
app_zone.app_servers -> data_zone.cache: Cache

data_zone.primary_db -> data_zone.replica_db: Replication {style.stroke-dash: 3}`,
  },
  {
    id: 'rest-api-sequence',
    name: 'REST API Lifecycle',
    type: 'sequence',
    description: 'Complete REST API request lifecycle with middleware, validation, caching, and error handling',
    code: `# REST API Request Lifecycle
shape: sequence_diagram

client: {
  label: Client
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

nginx: {
  label: Nginx
  style.fill: "#1e293b"
  style.stroke: "#94a3b8"
  style.font-color: "#e2e8f0"
}

rate_limiter: {
  label: Rate Limiter
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

auth_mw: {
  label: Auth Middleware
  style.fill: "#7c3aed"
  style.stroke: "#a78bfa"
  style.font-color: "#ffffff"
}

validator: {
  label: Validator
  style.fill: "#1e293b"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

controller: {
  label: Controller
  style.fill: "#4f46e5"
  style.stroke: "#818cf8"
  style.font-color: "#ffffff"
}

service: {
  label: Service Layer
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

cache: {
  label: Redis Cache
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

db: {
  label: Database
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

logger: {
  label: Logger
  style.fill: "#1e293b"
  style.stroke: "#94a3b8"
  style.font-color: "#e2e8f0"
}

# Request Phase
client -> nginx: GET /api/v1/users/123
nginx -> rate_limiter: Check rate limit
rate_limiter -> rate_limiter: Increment counter
rate_limiter -> auth_mw: Allowed

auth_mw -> auth_mw: Verify JWT token
auth_mw -> validator: Token valid
validator -> validator: Validate params and query
validator -> controller: Validation passed

# Business Logic
controller -> service: getUser(123)
service -> cache: GET user:123
cache -> service: Cache MISS

service -> db: SELECT * FROM users WHERE id=123
db -> service: User record

service -> cache: SET user:123 (TTL: 5m)
cache -> service: OK

service -> controller: User data
controller -> client: 200 OK (JSON)

# Logging
controller -> logger: Access log entry`,
  },
  {
    id: 'incident-response',
    name: 'Incident Response Flow',
    type: 'flow',
    description: 'Production incident response workflow from detection through post-mortem',
    code: `# Incident Response Flow
direction: down

title: {
  label: Incident Response Workflow
  near: top-center
  shape: text
  style.font-size: 24
  style.bold: true
}

detect: {
  label: Incident Detected
  shape: oval
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

source: {
  label: Detection Source?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

alert: {
  label: Automated Alert (PagerDuty)
  shape: rectangle
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

customer: {
  label: Customer Report
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

internal: {
  label: Internal Discovery
  shape: rectangle
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

triage: {
  label: Triage & Classify
  shape: rectangle
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

severity: {
  label: Severity Level?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

sev1: {
  label: SEV-1 (Critical)
  shape: rectangle
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

sev2: {
  label: SEV-2 (Major)
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

sev3: {
  label: SEV-3 (Minor)
  shape: rectangle
  style.fill: "#164e63"
  style.stroke: "#22d3ee"
  style.font-color: "#cffafe"
}

war_room: {
  label: Open War Room
  shape: rectangle
  style.fill: "#4c0519"
  style.stroke: "#fb7185"
  style.font-color: "#ffe4e6"
}

investigate: {
  label: Investigate Root Cause
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

mitigate: {
  label: Apply Mitigation
  shape: rectangle
  style.fill: "#78350f"
  style.stroke: "#fbbf24"
  style.font-color: "#fef3c7"
}

resolved: {
  label: Incident Resolved?
  shape: diamond
  style.fill: "#312e81"
  style.stroke: "#818cf8"
  style.font-color: "#e0e7ff"
}

comms: {
  label: Update Status Page & Stakeholders
  shape: rectangle
  style.fill: "#1e293b"
  style.stroke: "#94a3b8"
  style.font-color: "#e2e8f0"
}

postmortem: {
  label: Post-Mortem Review
  shape: rectangle
  style.fill: "#4c1d95"
  style.stroke: "#a78bfa"
  style.font-color: "#ede9fe"
}

action_items: {
  label: Create Action Items
  shape: rectangle
  style.fill: "#064e3b"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

closed: {
  label: Incident Closed
  shape: oval
  style.fill: "#065f46"
  style.stroke: "#34d399"
  style.font-color: "#d1fae5"
}

# Flow
detect -> source

source -> alert: monitoring
source -> customer: support ticket
source -> internal: team report

alert -> triage
customer -> triage
internal -> triage

triage -> severity

severity -> sev1: critical {style.stroke: "#fb7185"}
severity -> sev2: major {style.stroke: "#fbbf24"}
severity -> sev3: minor {style.stroke: "#22d3ee"}

sev1 -> war_room
sev2 -> investigate
sev3 -> investigate

war_room -> investigate
investigate -> mitigate

mitigate -> resolved

resolved -> investigate: no - escalate {style.stroke: "#fb7185"; style.stroke-dash: 3}
resolved -> comms: yes {style.stroke: "#34d399"}

comms -> postmortem
postmortem -> action_items
action_items -> closed`,
  }
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
