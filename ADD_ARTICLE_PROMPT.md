# Adding a New Engineering Article

Use this prompt with an AI assistant to quickly add a new article to Satthi's engineering journal.

---

## How Articles Work

- Each article is a standalone JSON file in `website/data/articles/`
- Files are numbered: `NNN-slug.json` (e.g. `012-redis-cluster-failover.json`)
- `website/data/articles/index.json` controls the order — **latest number listed first**
- The site loads all articles dynamically from the manifest

## Steps to Add an Article

### 1. Create the JSON file

New articles go in `website/data/articles/` numbered one higher than the current max.

Current count: **020** — so next article is `021-your-slug.json`.

### 2. Update the manifest

Add the new filename to the **top** of the `articles` array in `website/data/articles/index.json`.

### 3. JSON Schema

```json
{
  "id": 12,
  "number": "012",
  "slug": "kebab-case-slug",
  "title": "Article Title",
  "subtitle": "One-sentence summary of the engineering challenge and solution.",
  "category": "Cloud & IaC",
  "date": "2024",
  "readTime": "10 min read",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "metrics": [
    { "label": "Short label", "value": "42ms" },
    { "label": "Another metric", "value": "3x" },
    { "label": "Third metric", "value": "99.9%" }
  ],
  "overview": "2-3 sentence high-level overview of what this article covers.",
  "problem": "Describe the problem or constraint that drove this work.",
  "architecture": "Optional ASCII diagram showing the system design.",
  "implementation": [
    {
      "title": "Step / Component Title",
      "description": "What this part does and why.",
      "code": "// Optional code snippet\nconst x = 1;",
      "language": "typescript"
    }
  ],
  "impact": [
    "Specific measurable outcome or improvement.",
    "Another outcome."
  ],
  "lessons": [
    "Key insight or pattern learned.",
    "Another takeaway."
  ]
}
```

### Available Categories

| Category | Use for |
|---|---|
| `Cloud & IaC` | Terraform, Pulumi, Azure, GCP, AWS, networking |
| `DevOps & Systems` | Ansible, Kubernetes, CI/CD, server tuning, Helm |
| `Database Architecture` | Couchbase, PostgreSQL, MongoDB, RocksDB, migrations |
| `Distributed Systems` | Concurrency, queues, caching, session management, consensus |
| `FinTech & Billing` | Payments, SWIFT, double-entry accounting, billing engines |
| `Healthcare & FHIR` | HL7, FHIR R4, clinical data models, medical workflows |
| `Data Engineering` | BigQuery, Metabase, pipelines, analytics, CDC |
| `Python & Django` | Django REST Framework, DRF ViewSets, Celery, APScheduler, Python APIs |

Add new categories freely — they'll appear automatically in the site's filter bar.

---

## Prompt Template — Copy & Use with AI

```
I want to add a new article to my engineering journal (website/data/articles/).

Context about me (Sathyavarathan Sivabalasingam, aka Sathi):
- Principal Software Engineer based in Singapore
- Experience: Arogya Platform (healthcare, 7+ yrs), NETS Singapore (FinTech/SWIFT), 
  S&P Global (micro-frontends), xNara Biologics (MongoDB/AI), DSTA (enterprise systems)
- Stack: Go, Python, TypeScript/React, Couchbase, PostgreSQL, Kubernetes, Terraform, Azure, GCP

Topic: [DESCRIBE THE TOPIC / PASTE CODE OR NOTES]

Please write a complete article JSON file following this schema:
- File name: 012-slug.json (use next number after current max)
- Category: [choose from the list above]
- Include real implementation details, code snippets, and honest metrics
- Focus on the engineering decisions and trade-offs, not just "what" but "why"
- Write as if explaining to a senior engineer what you learned
- Make the architecture section an ASCII diagram if the system warrants it

Also update website/data/articles/index.json to add the new filename at the top of the array.
```

---

## Planned / Suggested Future Articles

These are based on Sathi's experience — add them when ready:

### From NETS Singapore (FinTech)
- `012-swift-message-processing-nets.json` — SWIFT MT/MX message parsing and settlement flows
- `013-payment-gateway-reliability-circuit-breakers.json` — Resilience patterns in payment systems
- `014-real-time-fraud-detection-rules-engine.json` — Rule-based fraud detection at transaction level

### From S&P Global
- `015-micro-frontends-module-federation.json` — Webpack Module Federation at scale
- `016-financial-data-normalization-pipeline.json` — Normalizing heterogeneous financial data sources

### From xNara Biologics
- `017-mongodb-schema-design-biological-data.json` — Document model design for genomics/lab data
- `018-agentic-ai-lab-workflow-automation.json` — LLM-driven lab workflow orchestration

### From DSTA / Government Systems
- `019-enterprise-sso-saml-integration.json` — SAML 2.0 SSO integration for government enterprise
- `020-audit-trail-immutable-event-log.json` — Append-only audit log with tamper detection

### Advanced Engineering
- `021-event-sourcing-cqrs-healthcare.json` — Event Sourcing and CQRS in healthcare records
- `022-zero-trust-network-architecture.json` — Zero trust networking for multi-tenant SaaS
- `023-performance-profiling-go-services.json` — CPU/memory profiling and optimization in Go
- `024-websocket-real-time-clinical-dashboard.json` — Real-time clinical dashboards via WebSocket
