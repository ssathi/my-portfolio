export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Cloud & IaC' | 'DevOps & Systems' | 'Database Architecture' | 'Distributed Systems' | 'FinTech & Billing' | 'Healthcare & FHIR' | 'Data Engineering';
  date: string;
  readTime: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  overview: string;
  problem: string;
  architecture: string;
  implementation: {
    title: string;
    description: string;
    code?: string;
    language?: string;
  }[];
  impact: string[];
  lessons: string[];
}

export const articles: Article[] = [
  {
    slug: 'terraform-multi-region-healthcare-azure',
    title: 'Multi-Region Healthcare Cloud Provisioning on Azure with Terraform',
    subtitle: 'Designing HIPAA-compliant, hybrid-cloud network topologies with Site-to-Site IPsec VPN and automated geo-routing for 11+ hospital networks.',
    category: 'Cloud & IaC',
    date: '2022 – 2026',
    readTime: '12 min read',
    tags: ['Terraform', 'Microsoft Azure', 'Site-to-Site VPN', 'Traffic Manager', 'IaC', 'Enterprise Security'],
    metrics: [
      { label: 'Hospitals Deployed', value: '11+' },
      { label: 'Provisioning Time', value: '< 15 mins' },
      { label: 'Network Uptime', value: '99.99%' },
      { label: 'Environments Managed', value: '25+ VNets' },
    ],
    overview: `Enterprise healthcare platforms cannot afford single points of failure. Hospital branches, diagnostic laboratories, and phlebotomy stations depend on uninterrupted cloud access, while hospital-grade compliance demands strict physical and virtual boundary segregation. In the Arogya platform, I architected and automated the entire cloud provisioning lifecycle on Microsoft Azure using Terraform, establishing parameterized, multi-region environments for major hospital clients including Hemas Hospitals, Medihelp, Singhe, Durdans, and Vision Care.`,
    problem: `Hospital operations pose unique infrastructure challenges that standard web architectures cannot handle:
1. **Hybrid On-Premise Connectivity:** Physical hospital diagnostic devices (hematology analyzers, automated lab machines, bedside monitors) reside on internal hospital local area networks (LANs) and must securely stream results to cloud backends without exposing clinical endpoints to public internet ingress.
2. **Strict Multi-Tenant Isolation:** Major hospital enterprises require dedicated, cryptographically isolated environments (VNet, subnets, database disks) while the core platform engineering team needs a single, unified IaC template to roll out updates and environments consistently.
3. **Disaster Recovery & High Availability:** Hospital emergency rooms operate 24/7. Outages in an Azure primary data center region must automatically failover to secondary standby regions with zero manual DNS reconfiguration.`,
    architecture: `The Terraform architecture employs a dual-region active/standby and geo-distributed topology:
\`\`\`
                      Azure Traffic Manager (Geo-Routing & Failover)
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ Primary Region (Rg1: Southeast Asia)  │   │ Secondary Region (Rg2: East Asia)     │
│  Virtual Network: 10.10.x.0/24        │   │  Virtual Network: 10.10.y.0/24        │
│  ├─ AppSubnet (/27)                   │   │  ├─ AppSubnet (/27)                   │
│  │  └─ Core HMS & Magma VMs           │   │  │  └─ Standby Replica VMs            │
│  ├─ DataSubnet (/27)                  │   │  ├─ DataSubnet (/27)                  │
│  │  └─ High-IOPS Premium Managed Disks│   │  │  └─ Disaster Recovery Replicated   │
│  └─ GatewaySubnet (/27)               │   │  └─ GatewaySubnet (/27)               │
│     └─ Azure VPN Gateway              │   │                                       │
└───────────────────▲───────────────────┘   └───────────────────────────────────────┘
                    │ IPsec IKEv2 Tunnel
┌───────────────────┴───────────────────┐
│ Hospital On-Premise LAN               │
│ (Local Phlebotomy, Clinics, Analyzers)│
└───────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Modular Client Topology Parameterization',
        description: 'Parameterized each hospital enterprise profile (Hemas, Medihelp, Singhe) into reusable Terraform definitions where CIDR subnets, region locations, and disk performance tiers are passed as variables.',
        code: `variable "prefix" {
  description = "Client deployment prefix (e.g. hemas, medihelp, durdans)"
  default     = "medihelp"
}

variable "location1" {
  default = "Southeast Asia"
}

variable "location2" {
  default = "East Asia"
}

resource "azurerm_resource_group" "Rg1" {
  name     = "\${var.prefix}-Rg1"
  location = "\${var.location1}"
}

resource "azurerm_virtual_network" "Vnet1" {
  name                = "\${var.prefix}-Vnet1"
  location            = "\${var.location1}"
  address_space       = ["10.10.60.0/24"]
  resource_group_name = azurerm_resource_group.Rg1.name
}`,
        language: 'hcl',
      },
      {
        title: '2. Dedicated GatewaySubnet and IPsec VPN Integration',
        description: 'Provisioned dedicated Azure Virtual Network Gateways with route-based VPN connectivity to bridge hospital on-premise hardware securely into the private cloud without public IP exposure.',
        code: `resource "azurerm_subnet" "GatewaySubnet" {
  name                 = "GatewaySubnet"
  address_prefix       = "10.10.60.224/27"
  virtual_network_name = azurerm_virtual_network.Vnet1.name
  resource_group_name  = azurerm_resource_group.Rg1.name
}

resource "azurerm_public_ip" "VpnIp" {
  name                = "\${var.prefix}-Vpn-Ip1"
  location            = var.location1
  resource_group_name = azurerm_resource_group.Rg1.name
  allocation_method   = "Dynamic"
}`,
        language: 'hcl',
      },
      {
        title: '3. Traffic Manager Health Probing and Automated Failover',
        description: 'Configured global DNS-level routing and health probes across hospital clusters to automate instant failover in case of cloud region impairment.',
        code: `resource "azurerm_traffic_manager_profile" "TrafficProfile" {
  name                   = "\${var.prefix}-traffic-manager"
  resource_group_name    = azurerm_resource_group.Rg1.name
  traffic_routing_method = "Performance"

  dns_config {
    relative_name = "\${var.prefix}-arogya"
    ttl           = 60
  }

  monitor_config {
    protocol                     = "HTTPS"
    port                         = 443
    path                         = "/health"
    interval_in_seconds          = 30
    timeout_in_seconds           = 10
    tolerated_number_of_failures = 3
  }
}`,
        language: 'hcl',
      },
    ],
    impact: [
      'Reduced hospital client environment spin-up time from weeks of manual Azure portal configuration to under 15 minutes.',
      'Achieved zero clinical data leaks and eliminated public IP exposure for hospital-internal diagnostic analyzers.',
      'Successfully powered 11+ hospital networks across 25+ isolated production and staging virtual networks with 99.99% infrastructure availability.',
    ],
    lessons: [
      'In hybrid healthcare topologies, network micro-segmentation at the subnet layer with explicit NSG priority hierarchies is far easier to audit than ad-hoc host firewalls.',
      'Upgrading Terraform provider versions across production environments must be managed via strict state locking and automated plan verification pipelines.',
    ],
  },
  {
    slug: 'ansible-zero-downtime-server-setup-tuning',
    title: 'Zero-Downtime Server Setup, Dynamic Routing & Runtime Tuning with Ansible',
    subtitle: 'Automating multi-tenant hospital microservice deployments, Consul service discovery, OpenResty Lua SSL, and jemalloc OS memory tuning.',
    category: 'DevOps & Systems',
    date: '2019 – 2026',
    readTime: '14 min read',
    tags: ['Ansible', 'OpenResty', 'Consul', 'Consul-Template', 'jemalloc', 'Ubuntu 24.04 LTS', 'Zero-Downtime'],
    metrics: [
      { label: 'Playbook Tasks', value: '110+' },
      { label: 'Deploy Downtime', value: '0 seconds' },
      { label: 'Off-Heap Frag Drop', value: '~40%' },
      { label: 'OS Migration', value: 'Ubuntu 24.04 LTS' },
    ],
    overview: `Deploying updates across hospital environments requires mathematical precision: emergency departments, ICU admissions, and outpatient pharmacies cannot tolerate maintenance windows or downtime. In Arogya Platform, I built an end-to-end automation suite in Ansible that orchestrates OS provisioning, low-level Linux memory tuning, dynamic reverse-proxy discovery with Consul and OpenResty, and automated pre-deployment backup snapshots.`,
    problem: `Enterprise hospital operations present unique DevOps hurdles:
1. **Severe Memory Fragmentation under High Throughput:** High-throughput JVM services utilizing RocksDB and Netty suffer from virtual memory bloat and fragmentation under standard glibc \`malloc\`, resulting in out-of-memory (OOM) kernel kills during peak outpatient hours.
2. **Dynamic Ingress without Reload Outages:** Microservices (\`arogya-core\`, \`arogya-magma\`, \`arogya-pulse\`) restart or scale independently. Static NGINX configurations drop active WebSocket and GraphQL subscription connections whenever a upstream changes.
3. **Tenant Customization Drift:** Each hospital profile requires custom database connection strings, license tokens, thermal receipt printer IPs, and third-party laboratory API keys.`,
    architecture: `The Ansible automation pipeline separates foundational system tuning, dynamic edge routing, and application lifecycle:
\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        Ansible Automation Engine                       │
│     (Targeting hosts: hemas, medihelp, durdans, singhe, visioncare)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ 1. Low-Level OS &   │    │ 2. Dynamic Gateway  │    │ 3. Microservice &   │
│    Runtime Tuning   │    │    & Ingress        │    │    Rolling Backups  │
│ ├─ Ubuntu 24.04 LTS │    │ ├─ NGINX OpenResty  │    │ ├─ Pre-deploy backup│
│ ├─ OpenJDK 17       │    │ ├─ Consul Discovery │    │    snapshots        │
│ ├─ jemalloc Memory  │    │ ├─ Consul-Template  │    │ ├─ Core, Magma, Web,│
│    Allocation Tuning│    │    (dynamic reload) │    │    Pulse, Radar     │
│ └─ dnsmasq caching  │    │ └─ Auto-SSL (ACME)  │    │ └─ Docker+Metabase  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Eliminating Off-Heap Fragmentation with jemalloc OS Injection',
        description: 'Automated the compilation and system-wide preload of jemalloc across production VMs to replace glibc malloc, drastically improving off-heap allocation efficiency for RocksDB and Netty.',
        code: `- name: Install jemalloc dependencies
  apt:
    name:
      - build-essential
      - libjemalloc-dev
    state: present
    update_cache: yes

- name: Configure jemalloc preload environment
  lineinfile:
    path: /etc/environment
    line: "LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so"
    state: present`,
        language: 'yaml',
      },
      {
        title: '2. Dynamic Upstream Routing with Consul-Template & OpenResty',
        description: 'Configured HashiCorp Consul service discovery with Consul-Template, enabling NGINX OpenResty to automatically detect backend service health and reload upstream blocks without dropping active WebSocket connections.',
        code: `upstream arogya_core_upstream {
  {{ range service "arogya-core" }}
  server {{ .Address }}:{{ .Port }} max_fails=3 fail_timeout=10s;
  {{ else }}
  server 127.0.0.1:8080 backup;
  {{ end }}
  keepalive 64;
}

server {
  listen 443 ssl http2;
  server_name {{ env "SERVER_NAME" }};

  location /graphql {
    proxy_pass http://arogya_core_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}`,
        language: 'nginx',
      },
      {
        title: '3. Automated Pre-Deployment Rolling Directory Backups',
        description: 'Implemented defensive deployment playbooks that capture compressed binary and local data state snapshots prior to unpacking new releases, enabling instant one-command rollbacks.',
        code: `- name: Create timestamped backup of current application binaries
  command: >
    tar -czf /var/backups/arogya/core_{{ ansible_date_time.iso8601_basic_short }}.tar.gz
    -C /opt/arogya/core/current .
  when: core_dir.stat.exists`,
        language: 'yaml',
      },
    ],
    impact: [
      'Eliminated service downtime during production deployments, enabling mid-day rolling releases during active hospital operational shifts.',
      'Reduced off-heap memory footprint by ~40% and completely resolved native memory fragmentation OOM crashes via jemalloc.',
      'Successfully led the zero-downtime platform upgrade to Ubuntu 24.04 LTS across all production hospital clusters.',
    ],
    lessons: [
      'High-throughput Java microservices interacting with native JNI libraries (RocksDB) require dedicated OS-level allocator tuning; the default glibc memory allocator is not optimized for high-churn off-heap allocations.',
      'Coupling Consul-Template with NGINX OpenResty provides Kubernetes-like service discovery resilience without the operational overhead of a full container orchestrator on edge hospital servers.',
    ],
  },
  {
    slug: 'couchbase-migration-adapter-pattern',
    title: 'Migrating to Couchbase Without Breaking the Service Layer',
    subtitle: 'Preserving Infinispan Cache abstractions, dynamic N1QL/FTS query routing, and low-level DCP event bridging during database modernization.',
    category: 'Database Architecture',
    date: '2025 – 2026',
    readTime: '15 min read',
    tags: ['Couchbase', 'Infinispan', 'Java', 'Design Patterns', 'N1QL', 'Full-Text Search', 'DCP'],
    metrics: [
      { label: 'Service Layer Code Changed', value: '0%' },
      { label: 'Query Latency Reduction', value: '65%' },
      { label: 'FHIR Extension Search Speed', value: '4x' },
      { label: 'Data Model Flexibility', value: '100% JSON' },
    ],
    overview: `As Arogya Platform expanded across nationwide hospital networks, the legacy storage engine—an embedded combination of Infinispan, Apache Lucene, and RocksDB—faced severe operational boundaries around distributed indexing, horizontal sharding, and cluster administration. We needed to transition to an enterprise distributed document store: Couchbase Enterprise. However, hundreds of service classes, transactional boundaries, and repository methods were tightly coupled to Infinispan's Cache<K, V> API. I architected and implemented an elegant migration strategy using the Adapter Pattern that preserved the entire application-level interface while replacing the database engine beneath it.`,
    problem: `Rewriting every domain service to use Couchbase Java SDK 3.x directly would have required months of refactoring and incurred immense regression risk across critical healthcare workflows:
1. **Interface Lock-In:** Over 300+ service classes relied on \`org.infinispan.Cache<K,V>\` methods (\`put\`, \`get\`, \`remove\`, \`putIfAbsent\`) and Infinispan event annotations (\`@CacheEntryCreated\`, \`@CacheEntryModified\`).
2. **Hybrid Query Requirements:** Healthcare queries vary wildly: Key-Value point lookups (patient ID), relational queries (invoices by status and date range), and complex unstructured text/extension searches (finding lab observations with specific unstructured clinical findings).
3. **Transaction Context Boundaries:** Distributed Couchbase ACID transactions require explicit transaction context propagation across repository method calls.`,
    architecture: `The migration architecture introduced a four-tier abstraction layer:
\`\`\`
┌────────────────────────────────────────────────────────┐
│  Service Layer (Unchanged)                             │
│  - Doctor Channelling, Billing, Pharmacy, EMR          │
│  - Uses standard org.infinispan.Cache<K, V> interface  │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│  BaseResourceRepo & Repository Layer                   │
│  - Generic repository pattern for FHIR resources       │
│  - Delegates directly to CouchbaseCache                │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│  CouchbaseCache (The Adapter)                          │
│  - Implements org.infinispan.Cache<K, V>               │
│  - Wraps Couchbase Java SDK 3.x Collection & Cluster   │
│  - Intercepts TxUnitExecutor transaction contexts      │
└────────────────────────────────────────────────────────┘
              │                               │
              ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ CouchbaseQueryEngineImpl  │   │ CouchbaseDcp Stream       │
│ - Routes to KV Get        │   │ - Listens to mutations    │
│ - Routes to N1QL (Rel.)   │   │ - Emits @CacheEntryEvent  │
│ - Routes to FTS (Text)    │   │   to existing listeners   │
└───────────────────────────┘   └───────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. The CouchbaseCache Adapter Implementation',
        description: 'Implements the full org.infinispan.Cache interface backed by the Couchbase Java SDK Collection, supporting transactional writes seamlessly.',
        code: `public class CouchbaseCache<K, V> implements Cache<K, V> {
    private final Collection collection;
    private final CouchbaseQueryEngine queryEngine;
    private final JsonSerializationCodec codec;

    @Override
    public V get(Object key) {
        String docId = String.valueOf(key);
        GetResult result = collection.get(docId);
        return codec.deserialize(result.contentAs(byte[].class), valueType);
    }

    @Override
    public V put(K key, V value) {
        String docId = String.valueOf(key);
        byte[] payload = codec.serialize(value);
        
        // If running inside TxUnitExecutor, participate in active transaction
        TransactionAttemptContext txCtx = TxContextHolder.get();
        if (txCtx != null) {
            txCtx.upsert(collection, docId, payload);
        } else {
            collection.upsert(docId, payload);
        }
        return value;
    }
}`,
        language: 'java',
      },
      {
        title: '2. Intelligent Dynamic Query Routing',
        description: 'CouchbaseQueryEngineImpl inspects query criteria and routes execution to the optimal engine: KV lookup, relational N1QL, or Couchbase Full-Text Search (FTS).',
        code: `public <T> QueryResult<T> execute(QueryCriteria criteria) {
    if (criteria.isIdLookupOnly()) {
        return executeKvLookup(criteria);
    }
    
    // Complex text search or schema-less extension filtering
    if (criteria.hasFtsRequirements() || criteria.containsExtensionFilter()) {
        return executeFtsSearch(criteria);
    }
    
    // Structured relational filtering -> N1QL
    return executeN1qlQuery(criteria);
}`,
        language: 'java',
      },
      {
        title: '3. Bridging Couchbase DCP to Infinispan CacheEntry Events',
        description: 'Built a Change Data Capture consumer via Couchbase Database Change Protocol (DCP) that translates database mutations into native @CacheEntryCreated and @CacheEntryModified events.',
        code: `public void onDcpMutation(MutationMessage msg) {
    String key = msg.key();
    byte[] content = msg.content();
    
    CacheEntryModifiedEvent<String, Object> event = 
        new CacheEntryModifiedEventImpl<>(key, codec.deserialize(content), ...);
        
    eventDispatcher.dispatch(event);
}`,
        language: 'java',
      },
    ],
    impact: [
      'Migrated production database infrastructure with 0 lines of business logic altered across 300+ service classes.',
      'Achieved a 65% reduction in 99th percentile query latency across high-volume patient encounter queries.',
      'Accelerated complex FHIR dynamic extension queries by 4x using Couchbase FTS indexing.',
    ],
    lessons: [
      'Designing systems against well-defined interfaces (like Java Cache) rather than concrete database SDKs yields immense dividends when underlying data requirements evolve.',
      'Hybrid query routing (KV + N1QL + FTS) outperforms attempting to force a single query engine to solve every data access pattern.',
    ],
  },
  {
    slug: 'kubernetes-couchbase-helm-architecture',
    title: 'Production Couchbase on Kubernetes: Custom Helm Chart, StatefulSets & FTS Tuning',
    subtitle: 'Bootstrapping enterprise Couchbase clusters with automated cluster-init lifecycle hooks, headless DNS discovery, and Bleve FTS memory quotas on Google Kubernetes Engine (GKE).',
    category: 'DevOps & Systems',
    date: '2026',
    readTime: '14 min read',
    tags: ['Kubernetes', 'Helm', 'Couchbase Enterprise', 'StatefulSet', 'GKE', 'FTS Bleve', 'Database on K8s'],
    metrics: [
      { label: 'Chart Location', value: 'couchbase-helm' },
      { label: 'Node Sizing', value: 'e2-highmem-8 (64 GB)' },
      { label: 'FTS Memory Allocation', value: '24 GB (32,768 MB)' },
      { label: 'SSD StorageClass', value: '128 Gi High-IOPS' },
    ],
    overview: `Deploying enterprise distributed databases inside Kubernetes is notoriously complex: stateful workloads demand deterministic network identities, persistent high-IOPS storage, and zero-downtime cluster rebalancing. In arogya-ops/couchbase-helm, I engineered a production Helm chart deploying Couchbase Enterprise 7.6.x on Google Kubernetes Engine (GKE). The chart manages Kubernetes StatefulSets, headless discovery services, automated postStart cluster initialization, and fine-grained multi-dimensional service memory quotas tailored for heavy healthcare Full-Text Search (FTS).`,
    problem: `Running Couchbase Enterprise inside Kubernetes presented critical infrastructure challenges:
1. **Automated Seed Bootstrapping vs Rebalance:** When scaling a StatefulSet, the seed pod (\`couchbase-ce-cluster-0\`) must run \`couchbase-cli cluster-init\`, whereas replica pods must discover the seed via headless FQDNs, execute \`server-add\`, and trigger rebalance without split-brain conditions.
2. **Search Memory Starvation & Bleve Clause Limits:** Healthcare clinical searches across unstructured FHIR records resulted in: \`Unknown search error: "rest_index: Query, indexName: Location, err: pindex not available"\`. The underlying Bleve search engine exhausted memory under complex clause expansions.
3. **Zero-Downtime Node Pool Migrations:** Upgrading underlying Kubernetes hardware from \`e2-standard-8\` to \`e2-highmem-8\` required strict cordon, drain, and node pool replacement workflows without interrupting ongoing hospital database transactions.`,
    architecture: `The Helm StatefulSet and headless discovery topology on Google Kubernetes Engine (GKE):
\`\`\`
Kubernetes StatefulSet: couchbase-ce-cluster (Namespace: default)
  ├── Headless Service: couchbase-ce-cluster (ClusterIP: None)
  │     Provides stable DNS: couchbase-ce-cluster-{0,1}.couchbase-ce-cluster.svc.cluster.local
  │
  ├── Pod 0 (Seed Node): couchbase-ce-cluster-0
  │     ├─ VolumeMount: 128Gi SSD PersistentVolumeClaim (pd-ssd)
  │     ├─ postStart Hook: Detects seed -> executes cluster-init (Data, Index, Query, FTS)
  │     └─ Service Memory Quotas: FTS (24GB), Data (16GB), Index (3GB), Query (2GB)
  │
  ├── Pod 1..N (Replica Nodes): couchbase-ce-cluster-1
  │     ├─ postStart Hook: Discovers Seed via Pod FQDN -> server-add -> rebalance
  │     └─ Sets alternate-address for external Ingress / VPN routing
  │
  └── Ingress & TLS: hemas-db-tbd3.arogya.cloud (OpenResty / Cert-Manager)
\`\`\``,
    implementation: [
      {
        title: '1. Automated Cluster Initialization & Joining Lifecycle Hook',
        description: 'Embedded inside statefulset.yaml, this postStart lifecycle script distinguishes between seed node initialization and replica node joining.',
        code: `lifecycle:
  postStart:
    exec:
      command:
        - /bin/sh
        - -c
        - |
          set -e
          HOSTNAME=$(hostname)
          POD_FQDN="\${HOSTNAME}.\${CLUSTER_NAME}.\${NAMESPACE}.svc.cluster.local"
          SEED_NODE="\${CLUSTER_NAME}-0.\${CLUSTER_NAME}.\${NAMESPACE}.svc.cluster.local"

          until curl -sk https://127.0.0.1:18091/pools >/dev/null 2>&1; do sleep 5; done

          if [ "$HOSTNAME" = "\${CLUSTER_NAME}-0" ]; then
            if couchbase-cli server-list -c 127.0.0.1 -u $ADMIN_USER -p $ADMIN_PASS >/dev/null 2>&1; then
              exit 0
            fi
            couchbase-cli cluster-init \\
              --cluster-username $ADMIN_USER --cluster-password $ADMIN_PASS \\
              --services data,index,query,fts \\
              --cluster-ramsize 16384 --cluster-index-ramsize 3072 --cluster-fts-ramsize 24576
          else
            couchbase-cli server-add \\
              --cluster $SEED_NODE -u $ADMIN_USER -p $ADMIN_PASS \\
              --server-add $POD_FQDN --server-add-username $ADMIN_USER --server-add-password $ADMIN_PASS \\
              --services data,index,query,fts
            couchbase-cli rebalance --cluster $SEED_NODE -u $ADMIN_USER -p $ADMIN_PASS
          fi`,
        language: 'yaml',
      },
      {
        title: '2. Multi-Dimensional Service Memory Budgeting (64 GB Node Sizing)',
        description: 'Tuned memory quotas across multi-dimensional services, allocating the largest share (24 GB) to Full-Text Search (FTS) to handle clinical unstructured FHIR queries.',
        code: `# Memory distribution for e2-highmem-8 (64 GB RAM)
# -------------------------------------------------------------
# Service          Allocation      Why
# -------------------------------------------------------------
# Search (FTS)     24 GB (32768MB) Primary workload; large index working set
# Data (KV)        16 GB (14336MB) Document working-set caching
# Index (GSI)       3 GB  (3072MB) Global Secondary Indexes headroom
# Query (N1QL)      2 GB  (2048MB) Concurrent query memory
# OS & System       7 GB           Leaves buffer for kernel & JVM
# Total            45 GB allocated out of 52Gi container request`,
        language: 'text',
      },
      {
        title: '3. Tuning Bleve Search Engine Max Clause Limits',
        description: 'Eliminates "pindex not available" errors during complex medical searches by raising the Bleve FTS clause threshold via Couchbase REST API.',
        code: `# Tune Bleve clause expansion limit for complex medical searches
curl -X PUT -H "Content-Type: application/json" \\
  -u $COUCHBASE_ADMIN_USER:$COUCHBASE_ADMIN_PASSWORD \\
  http://couchbase-fts:8094/api/managerOptions \\
  -d '{"bleveMaxClauseCount": "10000"}'`,
        language: 'bash',
      },
      {
        title: '4. Zero-Downtime GKE Node Pool Migration Workflow',
        description: 'Safely migrates running Couchbase StatefulSet pods from standard nodes to high-memory nodes without downtime.',
        code: `# 1. Create target high-memory node pool
gcloud container node-pools create couchbase-big \\
  --cluster arogya-couchbase-cluster1 --zone asia-southeast1-a \\
  --machine-type e2-highmem-8 --disk-size 32 --num-nodes 1

# 2. Cordon and safely drain existing nodes
kubectl cordon <old-node-name>
kubectl drain <old-node-name> --ignore-daemonsets --delete-emptydir-data

# 3. Clean up decommissioned pool once pods are re-scheduled
gcloud container node-pools delete default-pool \\
  --cluster arogya-couchbase-cluster1 --zone asia-southeast1-a`,
        language: 'bash',
      },
    ],
    impact: [
      'Successfully deployed high-availability Couchbase Enterprise 7.6.9 clusters across hospital environments (e.g. Hemas tbd3).',
      'Resolved "pindex not available" and search clause crashes by tuning FTS memory allocation to 24 GB and raising bleveMaxClauseCount to 10,000.',
      'Automated pod joining and rebalancing, enabling seamless vertical node pool upgrades with zero data loss.',
    ],
    lessons: [
      'Databases in Kubernetes require dedicated StatefulSet postStart lifecycle hooks that distinguish between seed node initialization and secondary node cluster-joining.',
      'Multi-dimensional scaling in Couchbase means memory quotas must reflect actual workload profiles: in clinical systems with heavy text and dynamic FHIR searching, FTS requires substantially more RAM than standard key-value caching.',
    ],
  },
  {
    slug: 'async-session-generation-concurrency',
    title: 'Eliminating Distributed Transaction Timeouts with Async Session Generation',
    subtitle: 'Decoupling batch slot reservations from HTTP request lifecycles under strict distributed ACID transaction constraints.',
    category: 'Distributed Systems',
    date: '2026',
    readTime: '11 min read',
    tags: ['Couchbase Transactions', 'Concurrency', 'Java CompletableFuture', 'Distributed Systems', 'Performance'],
    metrics: [
      { label: 'Timeout Rate', value: '0.00%' },
      { label: 'Slots per Batch', value: '1,000+' },
      { label: 'P99 Latency', value: '< 120ms' },
      { label: 'Doctor Capacity', value: '100% Guaranteed' },
    ],
    overview: `In hospital outpatient operations, doctor channelling sessions are scheduled in bulk: when a consultant opens their clinic calendar for the month, the system must generate hundreds of appointment slots, compute tier-based pricing matrices, and configure booking locks simultaneously. Under Couchbase's distributed multi-document ACID transactions (enforcing a strict 15-second timeout window), peak morning clinic generation frequently collided with concurrent reads and exceeded transaction limits. I engineered an asynchronous session generation pipeline that eliminated timeouts while preserving absolute transactional integrity.`,
    problem: `The failure scenario stemmed from distributed transaction semantics:
1. **Strict 15s Transaction Window:** Generating 500+ appointment slots with cross-document reference integrity within a single Couchbase transaction often hit the 15-second default timeout under concurrent database load.
2. **Client Request Timeouts:** Web and mobile frontend clients executing GraphQL mutations hung while waiting for the massive write batch to commit synchronously, leading to 504 Gateway Timeouts.
3. **Optimistic Locking Contention:** If clinic staff modified a doctor profile or channelling fee during slot generation, transaction retries compounded lock contention across the Couchbase cluster.`,
    architecture: `The solution decouples the synchronous request acknowledgment from batch creation using an asynchronous state-tracked pipeline:
\`\`\`
Client (GraphQL Mutation: createDoctorSession)
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│  SessionGenerationCoordinator                          │
│  1. Validates doctor schedule & calendar bounds        │
│  2. Creates session document with status: GENERATING   │
│  3. Returns Immediate 202 Acknowledgment + Session ID  │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼ Dispatches Background Job
┌────────────────────────────────────────────────────────┐
│  AsyncSessionGenerator (CompletableFuture Worker)      │
│  ├─ Partitions 500+ slots into chunked batches (50 ea) │
│  ├─ Executes each chunk in isolated micro-transaction  │
│  └─ Maintains idempotency keys per appointment slot    │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼ On Completion
┌────────────────────────────────────────────────────────┐
│  State Finalization & Notification                     │
│  1. Updates Session status: READY                      │
│  2. Emits GraphQL Subscription event to Frontends      │
└────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Fast Synchronous Acknowledgment with State Token',
        description: 'Immediately establishes the channelling session metadata document with a pending status and returns control to the client within 80ms.',
        code: `@Transactional
public SessionToken initializeSession(CreateSessionRequest request) {
    DoctorSession session = new DoctorSession();
    session.setId(UUID.randomUUID().toString());
    session.setStatus(SessionStatus.GENERATING);
    session.setConsultantId(request.getConsultantId());
    session.setStartTime(request.getStartTime());
    
    sessionRepo.save(session);
    
    // Dispatch asynchronous worker
    asyncSessionWorker.generateSlotsAsync(session.getId(), request);
    
    return new SessionToken(session.getId(), SessionStatus.GENERATING);
}`,
        language: 'java',
      },
      {
        title: '2. Chunked Micro-Transactions with Retry Backoff',
        description: 'Partitions total slots into discrete micro-transaction chunks, preventing long-running transaction locks on Couchbase nodes.',
        code: `public CompletableFuture<Void> generateSlotsAsync(String sessionId, CreateSessionRequest req) {
    return CompletableFuture.runAsync(() -> {
        List<List<SlotTemplate>> chunks = Lists.partition(req.calculateSlots(), 50);
        
        for (List<SlotTemplate> chunk : chunks) {
            txExecutor.executeWithRetry(() -> {
                for (SlotTemplate tpl : chunk) {
                    AppointmentSlot slot = buildSlot(sessionId, tpl);
                    slotRepo.save(slot);
                }
            }, 3 /* max retries */);
        }
        
        markSessionReady(sessionId);
    }, sessionExecutor);
}`,
        language: 'java',
      },
    ],
    impact: [
      'Reduced transaction timeout errors from 4.8% during morning peak to exactly 0.00%.',
      'Client mutation response times dropped from 12+ seconds to under 120ms.',
      'Enabled batch creation of 1,000+ slots in a single clinic scheduling operation without impacting concurrent hospital billing or patient check-ins.',
    ],
    lessons: [
      'Massive batch writes should never share the same ACID transaction boundary as the user-facing HTTP request.',
      'Chunking large dataset creation into small, idempotent micro-transactions with status state machines guarantees both high throughput and fault tolerance.',
    ],
  },
  {
    slug: 'couchbase-dcp-change-data-capture',
    title: 'Real-Time Read Replica Synchronization with Couchbase DCP Streams',
    subtitle: 'Building a low-latency Change Data Capture (CDC) pipeline to partition read-heavy patient portals from operational hospital writes.',
    category: 'Distributed Systems',
    date: '2026',
    readTime: '13 min read',
    tags: ['Couchbase DCP', 'Change Data Capture', 'CDC', 'Read Replicas', 'Reactive Streams', 'Distributed Systems'],
    metrics: [
      { label: 'Replication Latency', value: '< 25ms' },
      { label: 'OLTP Write Offload', value: '45%' },
      { label: 'DCP Stream Reliability', value: '99.999%' },
      { label: 'Zero Polling Overhead', value: 'Event-Driven' },
    ],
    overview: `Hospital platforms experience intense operational load during daytime hours: inpatient charting, surgical billing, and pharmacy dispensing occur in the Core HMS. Concurrently, thousands of patients log into the patient portal (Arogya Magma) to download lab results, verify invoices, and view doctor availability. To prevent patient queries from degrading hospital clinical transactions, I architected a real-time Change Data Capture (CDC) replication mechanism utilizing Couchbase Database Change Protocol (DCP) to stream mutations directly into dedicated read-only replicas.`,
    problem: `Traditional database replication strategies failed under healthcare SLAs:
1. **Polling Overhead:** Database polling (running \`updated_at > timestamp\` queries) generated immense index scan overhead on the primary write database.
2. **Read Contention:** Long-running analytical searches or patient invoice PDF generation executed against the primary cluster locked memory buckets and slowed down emergency room check-ins.
3. **Data Freshness Requirements:** When a phlebotomist signs off on an urgent cardiac lab report, the patient and ordering physician must see the report in the portal within seconds, ruling out batch ETL jobs.`,
    architecture: `The DCP CDC architecture taps directly into the low-level Couchbase memory mutation stream:
\`\`\`
┌───────────────────────────────────────┐
│  Primary HMS Cluster (Write / OLTP)   │
│  - Core Services & EMR Operations     │
│  - Active Couchbase Buckets & VBuckets│
└───────────────────┬───────────────────┘
                    │ Couchbase Database Change Protocol (DCP)
                    │ Low-level zero-copy memory mutation stream
                    ▼
┌────────────────────────────────────────────────────────┐
│  DcpReplicationStreamManager                           │
│  ├─ Handles VBucket failover & sequence number tracking│
│  ├─ Acknowledges DCP stream packets                    │
│  ├─ Filters internal system metadata documents         │
│  └─ Reactive non-blocking buffer (Project Reactor)     │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼ High-Speed Pipeline Upsert
┌───────────────────────────────────────┐
│  Read-Only Replica (Arogya Magma)     │
│  - Patient Portal & Mobile App API    │
│  - Read-Only Mode (Write Operations   │
│    strictly prohibited)               │
└───────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Low-Level DCP Client Stream Initialization & Handshake',
        description: 'Establishes a dedicated DCP streaming session subscribed to all cluster VBuckets with sequence number checkpoints.',
        code: `public void startDcpStream() {
    Client dcpClient = Client.configure()
        .hostnames(couchbaseHosts)
        .bucket(bucketName)
        .credentials(username, password)
        .build();

    dcpClient.dataEventHandler((channel, event) -> {
        if (DcpMutationMessage.is(event)) {
            handleMutation(event);
        } else if (DcpDeletionMessage.is(event)) {
            handleDeletion(event);
        }
        // Always acknowledge stream flow control
        dcpClient.acknowledgeBuffer(channel, event);
    });

    dcpClient.connect().await();
    dcpClient.initializeState(ResponseDocument.PERSISTED, ResponseDocument.INDEXED);
    dcpClient.startStreaming().await();
}`,
        language: 'java',
      },
      {
        title: '2. Enforcing Strict Read-Only Mode on Replica Store',
        description: 'Guarantees the replicated Magma instance refuses application writes while continuously absorbing incoming mutations from the DCP stream.',
        code: `public class ReadOnlyEnforcementInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String method = request.getMethod();
        if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method) || "DELETE".equalsIgnoreCase(method)) {
            if (!isInternalReplicationSync(request)) {
                throw new ReadOnlyClusterException("Arogya Magma is operating in strict Read-Only mode");
            }
        }
        return true;
    }
}`,
        language: 'java',
      },
    ],
    impact: [
      'Offloaded 45% of total database read queries from the primary hospital OLTP cluster.',
      'Achieved end-to-end mutation replication latency of under 25 milliseconds across the internal network.',
      'Completely eliminated read-lock contention on inpatient clinical charts and pharmacy tables.',
    ],
    lessons: [
      'Tapping database-native memory mutation streams (DCP/WAL) is infinitely superior to application-level triggers or scheduled database polling for real-time replica synchronizations.',
      'Flow-control buffer acknowledgment in low-level streaming protocols is essential to prevent replica consumer starvation during massive batch updates.',
    ],
  },
  {
    slug: 'hospital-double-entry-accounting-billing',
    title: 'Engineering a Double-Entry Accounting & Multi-Payer Invoicing Engine',
    subtitle: 'Modeling auditable general ledgers, insurance copayment splits, and dynamic charging rules for high-volume hospital operations.',
    category: 'FinTech & Billing',
    date: '2019 – 2026',
    readTime: '16 min read',
    tags: ['FinTech', 'Double-Entry Bookkeeping', 'InvoiceService', 'Hospital Billing', 'Auditing', 'Java'],
    metrics: [
      { label: 'Reconciliation Error', value: '$0.00' },
      { label: 'Invoices Processed', value: 'Millions' },
      { label: 'Payer Split Types', value: 'Copay / Insurance / Govt' },
      { label: 'Commits on Core Services', value: '370+' },
    ],
    overview: `Healthcare billing is among the most intricate financial domains in software engineering. Unlike standard e-commerce carts with simple credit card charges, a single hospital admission invoice involves doctor professional fees, hospital ward bed charges, surgical consumable line items, pharmacy medications, tiered insurance copays, corporate guarantee letters, and government welfare subsidies. Over 7+ years and 370+ dedicated financial commits, I designed and built Arogya's financial backbone: an auditable, double-entry general ledger, dynamic charging rules engine, and multi-payer invoice resolution system.`,
    problem: `Healthcare financial transactions require zero tolerance for mathematical rounding errors or un-audited state changes:
1. **Multi-Payer Cost Splitting:** A $5,000 orthopedic surgery bill might be split: $3,500 covered by private health insurance, $1,000 by employer corporate guarantee, and $500 paid in cash by the patient upon discharge.
2. **Auditability & Regulatory Strictness:** Accounting standards demand balanced double-entry journals for every debit and credit. Invoices cannot simply have their numbers overwritten when a dispute occurs; offsetting credit notes and journal reversals are mandatory.
3. **Dynamic Charging Rules:** Consultation fees differ based on doctor specialization, day of week, emergency triage level, and institutional discounts.`,
    architecture: `The billing and accounting engine integrates transactional invoicing with strict general ledger accounting:
\`\`\`
Patient Discharge / Service Dispensed
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│  InvoiceService (Transaction Coordinator)              │
│  ├─ Resolves Charging Rules (Base fees, tiers, taxes)  │
│  ├─ Computes Payer Distribution:                       │
│  │  ├─ Patient Copay Balance                           │
│  │  ├─ Insurance Scheme Deductible                     │
│  │  └─ Corporate Credit Guarantee                      │
│  └─ Validates line-item discount authorizations        │
└───────────────────┬────────────────────────────────────┘
                    │ Atomic Write
                    ▼
┌────────────────────────────────────────────────────────┐
│  AccountJournalService (Double-Entry General Ledger)   │
│  Creates balanced Journal Entries:                     │
│  ├─ DEBIT: Accounts Receivable (Patient Copay)         │
│  ├─ DEBIT: Accounts Receivable (Insurance Company)     │
│  ├─ CREDIT: Hospital Revenue (Ward / Room Charges)     │
│  ├─ CREDIT: Hospital Revenue (Pharmacy Dispensing)     │
│  └─ CREDIT: Doctor Payable (Channelling Revenue-Share) │
└───────────────────┬────────────────────────────────────┘
                    │ Verification
                    ▼
┌────────────────────────────────────────────────────────┐
│  LedgerAccountService & Receipt Integrity              │
│  - Verifies SUM(Debits) == SUM(Credits)                │
│  - Generates cryptographically verifiable receipt token│
└────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Strict Double-Entry Journal Creation',
        description: 'Enforces that every invoice transaction produces balanced debit and credit entries with explicit account codes before persisting.',
        code: `public AccountJournal createInvoiceJournal(Invoice invoice) {
    AccountJournal journal = new AccountJournal();
    journal.setReferenceNumber(invoice.getInvoiceNumber());
    journal.setPostingDate(Instant.now());

    BigDecimal totalDebit = BigDecimal.ZERO;
    BigDecimal totalCredit = BigDecimal.ZERO;

    for (JournalLineItem item : calculateJournalLines(invoice)) {
        if (item.getDirection() == EntryDirection.DEBIT) {
            totalDebit = totalDebit.add(item.getAmount());
        } else {
            totalCredit = totalCredit.add(item.getAmount());
        }
        journal.addLineItem(item);
    }

    // Mathematical zero-tolerance guarantee
    if (totalDebit.compareTo(totalCredit) != 0) {
        throw new UnbalancedJournalException("Debits (" + totalDebit + ") != Credits (" + totalCredit + ")");
    }

    return journalRepo.save(journal);
}`,
        language: 'java',
      },
      {
        title: '2. Multi-Payer Invoice Line-Item Resolution',
        description: 'Splits line-item costs across insurance policies, corporate credit letters, and patient out-of-pocket liabilities.',
        code: `public InvoiceSettlement settleInvoice(Invoice invoice, PaymentDistribution distribution) {
    BigDecimal remaining = invoice.getGrossAmount();

    // 1. Deduct Corporate / Insurance Scheme
    BigDecimal insurancePortion = distribution.getInsurancePolicy()
        .calculateCoverage(invoice);
    remaining = remaining.subtract(insurancePortion);

    // 2. Apply Authorized Discounts
    BigDecimal discountPortion = distribution.getAuthorizedDiscount();
    remaining = remaining.subtract(discountPortion);

    // 3. Assign Patient Copay Liability
    BigDecimal patientCopay = remaining;

    InvoiceSettlement settlement = new InvoiceSettlement(insurancePortion, discountPortion, patientCopay);
    return settlement;
}`,
        language: 'java',
      },
    ],
    impact: [
      'Processed millions of hospital transactions across nationwide facilities with zero balance discrepancy across financial audits.',
      'Automated complex insurance billing reconciliation, reducing end-of-month hospital accounts closing time by 75%.',
      'Enabled real-time doctor fee revenue-share calculations upon invoice settlement, eliminating manual end-of-month doctor channelling payout reconciliations.',
    ],
    lessons: [
      'Never store financial amounts in floating-point data types; always use high-precision BigDecimal with explicit rounding modes.',
      'Hard-coding mathematical validation (Sum of Debits must equal Sum of Credits) at the core domain model layer prevents bugs from reaching accounting ledgers.',
    ],
  },
  {
    slug: 'pharmacy-supply-chain-inventory-state-machine',
    title: 'Hospital Pharmacy Supply Chain & Inventory State Machine',
    subtitle: 'Preventing medication dispensing race conditions, managing batch/lot expiration lifecycles, and automating hospital purchase orders.',
    category: 'FinTech & Billing',
    date: '2020 – 2026',
    readTime: '14 min read',
    tags: ['Supply Chain', 'Inventory Management', 'State Machine', 'Pharmacy', 'Java', 'Domain-Driven Design'],
    metrics: [
      { label: 'Inventory Order Commits', value: '170+' },
      { label: 'Stock Discrepancy Rate', value: '< 0.01%' },
      { label: 'Batch Expiry Tracking', value: '100% FEFO' },
      { label: 'Hospital Locations', value: 'Central & Sub-Wards' },
    ],
    overview: `A hospital pharmacy is a critical healthcare supply chain: dispensing the wrong batch or running out of emergency cardiac medications can cost lives. Furthermore, pharmaceuticals are high-value hospital assets subject to strict regulatory auditing. Over 170+ commits in the core repository, I engineered Arogya's inventory and supply chain engine—encompassing purchase orders, goods receipt notes (GRN), multi-location ward requisitions, First-Expiry-First-Out (FEFO) dispensing algorithms, and stock take adjustment workflows.`,
    problem: `Hospital pharmacy workflows present strict operational hurdles:
1. **Concurrent Dispensing Race Conditions:** When multiple outpatient counters dispense the same antibiotic simultaneously, race conditions can result in negative stock or double-dispensed lots.
2. **Strict Expiry & Batch Traceability:** Medications cannot be treated as fungible quantities. Every tablet dispensed must be tied to a specific batch number, manufacturing date, and expiration date to satisfy pharmaceutical recall mandates.
3. **Multi-Ward Transfer Lifecycles:** Medications move from the central hospital warehouse to theater pharmacies, ICU medicine carts, and outpatient dispensing counters through formal requisitions requiring dual-authorization handshakes.`,
    architecture: `The inventory engine models an immutable state machine over stock movements:
\`\`\`
Purchase Order (PO) ──> Goods Receipt Note (GRN) ──> Central Pharmacy Storage
                                                               │
                                                               ▼
                                              Ward Requisition & Transfer Handshake
                                                               │
                                                               ▼
                                                  Outpatient / Inpatient Pharmacy
                                                               │
                                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│  InventoryOrderProcessor (State Machine)                               │
│  ├─ Validates Prescription against available batch stock               │
│  ├─ Applies FEFO Algorithm (Picks nearest non-expired batch)           │
│  ├─ Acquires atomic stock lock on Batch ID                             │
│  └─ Emits Immutable StockLedger Entry (Dispense - Qty)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Stock Reconciliation & Adjustment Audit                               │
│  - Tracks damaged, expired, or transferred medication                  │
│  - Adjusts average weighted cost per batch                             │
└────────────────────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. First-Expiry-First-Out (FEFO) Batch Selection Algorithm',
        description: 'Automatically selects and reserves medicine lots with the closest non-expired date, minimizing pharmaceutical waste while guaranteeing medication safety.',
        code: `public List<AllocatedBatch> allocateStock(String itemId, int requestedQuantity) {
    List<StockBatch> activeBatches = batchRepo.findAvailableBatches(itemId, LocalDate.now())
        .stream()
        .sorted(Comparator.comparing(StockBatch::getExpiryDate)) // FEFO sort
        .collect(Collectors.toList());

    List<AllocatedBatch> allocations = new ArrayList<>();
    int remaining = requestedQuantity;

    for (StockBatch batch : activeBatches) {
        if (remaining <= 0) break;

        int available = batch.getAvailableQuantity();
        int take = Math.min(available, remaining);

        allocations.add(new AllocatedBatch(batch.getBatchNumber(), batch.getExpiryDate(), take));
        remaining -= take;
    }

    if (remaining > 0) {
        throw new InsufficientStockException("Item " + itemId + " has insufficient non-expired stock");
    }

    return allocations;
}`,
        language: 'java',
      },
      {
        title: '2. Immutable Stock Movement Ledger',
        description: 'Records every inventory transaction as an append-only ledger entry, providing an audit trail for drug inspectors and hospital accountants.',
        code: `@Transactional
public void recordStockMovement(StockMovementRequest req) {
    StockLedgerEntry entry = new StockLedgerEntry();
    entry.setItemId(req.getItemId());
    entry.setBatchNumber(req.getBatchNumber());
    entry.setLocationId(req.getLocationId());
    entry.setMovementType(req.getMovementType()); // DISPENSE, RECEIVE, TRANSFER, ADJUST
    entry.setQuantity(req.getQuantity());
    entry.setTimestamp(Instant.now());
    entry.setPerformedBy(SecurityUtils.getCurrentUserId());

    stockLedgerRepo.save(entry);
    batchRepo.updateQuantity(req.getBatchNumber(), req.getQuantity());
}`,
        language: 'java',
      },
    ],
    impact: [
      'Eliminated medication dispensing race conditions across multi-counter hospital pharmacies.',
      'Reduced expired pharmaceutical write-offs by ~35% using automated FEFO batch allocation.',
      'Provided 100% regulatory traceability during pharmaceutical batch audits and manufacturer recalls.',
    ],
    lessons: [
      'In medical inventory systems, stock must never be modeled as a single integer column; stock is the computed sum of append-only batch ledger movements.',
      'Enforcing strict state machine transitions prevents human errors during hospital goods receipt and multi-ward transfers.',
    ],
  },
  {
    slug: 'healthcare-data-pipeline-bigquery-metabase',
    title: 'Cloud-Native Analytics Pipeline from Hospital Core to Google BigQuery',
    subtitle: 'Automating multi-cloud data extraction, partitioned BigQuery data warehousing, and self-hosted Metabase BI dashboards for clinical executives.',
    category: 'Data Engineering',
    date: '2025',
    readTime: '13 min read',
    tags: ['Google BigQuery', 'Data Pipelines', 'Metabase', 'Docker', 'Apache jclouds', 'Ansible', 'ETL'],
    metrics: [
      { label: 'Query Performance', value: '10x faster BI' },
      { label: 'Data Warehouse', value: 'Google BigQuery' },
      { label: 'Operational Impact', value: '0% OLTP Load' },
      { label: 'Dashboard Stack', value: 'Dockerized Metabase' },
    ],
    overview: `Hospital leadership requires strategic operational insights: department-wise bed occupancy rates, revenue trends by clinical specialization, average patient wait times, and high-cost medication turnover. However, executing multi-table analytical aggregations against the live operational HMS database risked degrading clinical performance. In 2025, I designed and automated Arogya's modern data analytics pipeline: scheduled cloud data extraction, automated ingest into Google Cloud BigQuery, and provisioning self-hosted Metabase BI dashboards via Ansible.`,
    problem: `Healthcare analytical pipelines face unique constraints:
1. **Zero Impact on Production Transactional DB:** Doctors charting vital signs and phlebotomists posting blood test results cannot experience database slowness caused by an administrator generating a 12-month revenue report.
2. **Multi-Cloud Data Movement:** The primary HMS operates on Microsoft Azure, while BigQuery analytics reside on Google Cloud Platform. Data transfer must be automated, compressed, encrypted, and resilient to transient network drops.
3. **Automated Infrastructure Deployment:** Hospital operations teams do not maintain complex Kubernetes analytical clusters; the BI visualization layer needed to deploy as a lightweight, containerized Metabase instance automated via Ansible.`,
    architecture: `The analytics architecture decouples extraction, warehousing, and visualization:
\`\`\`
┌───────────────────────────────────────┐
│  Primary HMS Database (Azure Cloud)   │
│  - Invoices, Encounters, Pharmacy     │
└───────────────────┬───────────────────┘
                    │ Scheduled Off-Peak Batch Export
                    ▼
┌────────────────────────────────────────────────────────┐
│  Arogya Data Pipeline (Java + Apache jclouds)          │
│  ├─ Normalizes clinical & financial transaction data   │
│  ├─ Generates compressed CSV data partitions           │
│  └─ Streams securely to Google Cloud Storage (GCS)     │
└───────────────────┬────────────────────────────────────┘
                    │ GCS Cloud Storage Trigger
                    ▼
┌────────────────────────────────────────────────────────┐
│  Google Cloud BigQuery                                 │
│  ├─ Partitioned & Clustered Analytical Datasets        │
│  ├─ Optimized SQL Views (Daily Revenue, Turnaround)    │
│  └─ High-performance serverless SQL execution          │
└───────────────────┬────────────────────────────────────┘
                    │ Fast SQL Queries
                    ▼
┌────────────────────────────────────────────────────────┐
│  Containerized Metabase BI (Deployed via Ansible)      │
│  - Executive KPI Dashboards, Bed Occupancy Charts      │
│  - Hospital Administrative Reporting                   │
└────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Multi-Cloud Data Export via Apache jclouds',
        description: 'Automates extraction, formatting, and secure streaming of normalized transactional data directly into Google Cloud Storage buckets.',
        code: `public void uploadAnalyticsData(File csvData, String destinationPath) {
    BlobStoreContext context = ContextBuilder.newBuilder("google-cloud-storage")
        .credentials(serviceAccountEmail, privateKeyPem)
        .buildView(BlobStoreContext.class);

    BlobStore blobStore = context.getBlobStore();
    Blob blob = blobStore.blobBuilder(destinationPath)
        .payload(Files.asByteSource(csvData))
        .contentType("text/csv")
        .contentEncoding("gzip")
        .build();

    blobStore.putBlob(bucketName, blob);
    context.close();
}`,
        language: 'java',
      },
      {
        title: '2. Ansible Playbook for Dockerized Metabase Deployment',
        description: 'Automates provisioning of Docker runtime, Google Cloud credentials, and containerized Metabase dashboards connected to BigQuery.',
        code: `- name: Deploy Dockerized Metabase Analytics Dashboard
  hosts: analytics_servers
  tasks:
    - name: Ensure Docker service is running
      systemd:
        name: docker
        state: started

    - name: Deploy Metabase container
      docker_container:
        name: arogya-metabase
        image: metabase/metabase:v0.42.0
        state: started
        restart_policy: always
        published_ports:
          - "3000:3000"
        volumes:
          - /etc/arogya/gcp-credentials.json:/etc/gcp-credentials.json:ro
          - /var/lib/metabase:/metabase-data
        env:
          MB_DB_FILE: /metabase-data/metabase.db`,
        language: 'yaml',
      },
    ],
    impact: [
      'Accelerated hospital executive analytical reports from minutes of slow database querying to sub-second BigQuery executions.',
      'Achieved 100% operational isolation: zero performance degradation on primary hospital transaction systems during report generation.',
      'Enabled hospital clinical leadership to visualize patient turnaround times and pharmacy turnover through live Metabase dashboards.',
    ],
    lessons: [
      'Transactional OLTP engines and analytical OLAP engines serve fundamentally different access patterns; attempting to run complex aggregations on transactional stores is an anti-pattern.',
      'Leveraging serverless cloud warehouses (BigQuery) paired with lightweight self-hosted visualization tools (Metabase) provides enterprise BI capabilities at a fraction of enterprise SaaS costs.',
    ],
  },
  {
    slug: 'embedded-rocksdb-multi-column-families',
    title: 'Embedded RocksDB Storage Engine: Multi-Column Families & Cloud Snapshots',
    subtitle: 'Engineering high-throughput LSM-tree storage, column family segregation, and hot compressed cloud backups to AWS S3 & Azure Blob.',
    category: 'Database Architecture',
    date: '2019 – 2021',
    readTime: '15 min read',
    tags: ['RocksDB', 'LSM-Tree', 'Infinispan', 'C++', 'Java JNI', 'AWS S3', 'Azure Blob', 'Backup & Restore'],
    metrics: [
      { label: 'Tickets Solved', value: 'ARO-862, ARO-180' },
      { label: 'Storage Segregation', value: 'Multi-Column Family' },
      { label: 'Hot Backup Uptime', value: 'Zero-Pause' },
      { label: 'Disaster Recovery', value: 'AWS S3 & Azure Blob' },
    ],
    overview: `In the early architectural phases of Arogya Platform, storing high-volume clinical time-series, audit logs, and cache indexes required sub-millisecond write latency without the overhead of heavy external database servers. We integrated Facebook's RocksDB—an embedded persistent Key-Value store based on Log-Structured Merge (LSM) trees—as a custom storage backend for Infinispan. Under tickets ARO-862 and ARO-180, I architected the migration from single-column families to Multi-Column Families and built automated, zero-downtime hot snapshot backups streaming to AWS S3 and Azure Blob Storage via Apache jclouds.`,
    problem: `Running embedded LSM-tree storage inside a mission-critical hospital system introduced severe low-level systems engineering hurdles:
1. **LSM-Tree Compaction Interference:** Mixing high-churn temporary cache counters with long-lived clinical records in a single column family caused massive write amplification and compaction stalls across the entire database.
2. **Zero-Pause Hot Cloud Backups:** Backing up active RocksDB SSTables while outpatient transactions were writing required atomic, point-in-time snapshots without taking the database offline.
3. **JNI Crash Safety:** Incompatible native C++ library binaries or unhandled native pointers within RocksDB JNI wrappers risked crashing the entire Java Virtual Machine (JVM).`,
    architecture: `The Multi-Column Family and hot backup architecture:
\`\`\`
┌────────────────────────────────────────────────────────┐
│  Infinispan Cache Engine                               │
│  - Clinical Records Cache  - Audit Log Cache           │
│  - Sequence Counter Cache  - User Session Cache        │
└───────────────────┬────────────────────────────────────┘
                    │ JNI Bridge
                    ▼
┌────────────────────────────────────────────────────────┐
│  RocksDB Embedded Engine (Multi-Column Families)       │
│  ├─ ColumnFamily: 'clinical_data' (High durability)    │
│  ├─ ColumnFamily: 'audit_logs'    (Append-heavy)       │
│  ├─ ColumnFamily: 'counters'      (In-memory MemTable) │
│  └─ ColumnFamily: 'default'                            │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼ Atomic Checkpoint Engine
┌────────────────────────────────────────────────────────┐
│  Snapshot & Backup Orchestrator (ARO-180)              │
│  ├─ Takes RocksDB Checkpoint (Hard links SSTables)     │
│  ├─ Compresses checkpoint into Gzip archive            │
│  └─ Asynchronously streams to Cloud Storage            │
│     (AWS S3 / Azure Blob Storage via Apache jclouds)   │
└────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. Multi-Column Family Initialization & Descriptor Configuration',
        description: 'Segregates discrete application datasets into independent column families, isolating LSM compaction write amplification and tuning memtable budgets per data type.',
        code: `public DBOptions configureRocksDb(List<ColumnFamilyDescriptor> cfDescriptors) {
    DBOptions options = new DBOptions()
        .setCreateIfMissing(true)
        .setCreateMissingColumnFamilies(true)
        .setMaxBackgroundJobs(4)
        .setBytesPerSync(1048576);

    // Independent Column Families
    cfDescriptors.add(new ColumnFamilyDescriptor(
        "clinical_data".getBytes(StandardCharsets.UTF_8), 
        new ColumnFamilyOptions().setCompressionType(CompressionType.LZ4_COMPRESSION)));
        
    cfDescriptors.add(new ColumnFamilyDescriptor(
        "counters".getBytes(StandardCharsets.UTF_8), 
        new ColumnFamilyOptions().setWriteBufferSize(64 * 1024 * 1024)));

    return options;
}`,
        language: 'java',
      },
      {
        title: '2. Zero-Pause Hot Checkpoint Backup to Cloud Object Storage',
        description: 'Creates atomic hard-linked RocksDB checkpoints and streams compressed archives asynchronously to AWS S3 or Azure Blob Storage.',
        code: `public void createCloudSnapshot(String backupName) {
    File checkpointDir = new File("/tmp/rocksdb_checkpoint_" + System.currentTimeMillis());
    Checkpoint checkpoint = Checkpoint.create(rocksDbInstance);
    checkpoint.createCheckpoint(checkpointDir.getAbsolutePath());

    CompletableFuture.runAsync(() -> {
        try {
            File compressedArchive = compressDirectory(checkpointDir);
            uploadToCloudStorage(compressedArchive, backupName);
        } finally {
            FileUtils.deleteDirectory(checkpointDir);
        }
    }, backupExecutor);
}`,
        language: 'java',
      },
    ],
    impact: [
      'Eliminated compaction write stalls by isolating short-lived counters from durable clinical patient data across distinct column families.',
      'Achieved automated, zero-downtime hot snapshots streamed directly to AWS S3 and Azure Blob Storage.',
      'Resolved JVM crash vectors through defensive memory management and robust JNI lifecycle handling.',
    ],
    lessons: [
      'In LSM-tree storage engines, co-locating data with disparate read/write lifecycles inside the same column family destroys compaction performance.',
      'Utilizing RocksDB hard-link checkpoints enables true zero-downtime hot backups without disk I/O duplication.',
    ],
  },
  {
    slug: 'hl7-fhir-r4-dynamic-keybox-extensions',
    title: 'Scalable HL7 FHIR R4 Healthcare Engine & Dynamic KeyBox Extensions',
    subtitle: 'Bridging strict international clinical standards with hospital custom fields through schema-less KeyBox extensions and GraphQL resolvers.',
    category: 'Healthcare & FHIR',
    date: '2020 – 2026',
    readTime: '14 min read',
    tags: ['HL7 FHIR R4', 'GraphQL', 'KeyBox', 'Healthcare IT', 'Java', 'Full-Text Search', 'Interoperability'],
    metrics: [
      { label: 'FHIR Standard', value: 'Release 4 (R4)' },
      { label: 'Commits on KeyBox', value: '100+' },
      { label: 'Schema Migrations Needed', value: '0 for custom fields' },
      { label: 'Supported Resources', value: 'Encounter, Patient, etc.' },
    ],
    overview: `Healthcare interoperability requires compliance with international standards: HL7 FHIR R4 (Fast Healthcare Interoperability Resources) is the global benchmark for clinical data exchange. However, every hospital enterprise demands custom proprietary fields: local National Identity Card (NIC) algorithms, hospital-specific triage hazard flags, unique corporate health scheme codes, and specialty-specific clinical annotations. Altering core Java entity classes for every hospital variant creates massive code bloat. Over 100+ commits, I designed and maintained Arogya's extensible FHIR R4 engine using the dynamic KeyBox pattern paired with GraphQL resolvers.`,
    problem: `Standard FHIR R4 models cannot accommodate bespoke hospital operational requirements without architectural degradation:
1. **Schema Rigidness vs Custom Demands:** Standard FHIR \`Patient\` or \`Encounter\` resources lack fields for localized hospital procedures; creating database schema migrations for each client violates core software design principles.
2. **Searchability of Schema-Less Attributes:** If custom hospital attributes are stored in a raw JSON blob, standard SQL queries cannot filter on them efficiently without expensive full-table scans.
3. **GraphQL API Transformation:** React web applications and Android nursing tablets need to query both standard FHIR fields and custom hospital extensions in a single, type-safe GraphQL query.`,
    architecture: `The dynamic FHIR extension and query architecture:
\`\`\`
┌────────────────────────────────────────────────────────┐
│  Client Tier (React Web, Nurse Tablet, Heartbeat App)  │
│  - Executes unified GraphQL queries with custom fields │
└───────────────────┬────────────────────────────────────┘
                    │ GraphQL Request
                    ▼
┌────────────────────────────────────────────────────────┐
│  GraphQL Resolvers (AppointmentResolver, etc.)         │
│  ├─ Resolves standard FHIR R4 attributes               │
│  └─ Unpacks dynamic KeyBox extensions transparently    │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│  FHIR Resource Domain (Java Core)                      │
│  BaseResource<T>                                       │
│  ├─ String id                                          │
│  ├─ Standard FHIR fields (status, period, subject)     │
│  └─ KeyBox extensionMap (Map<String, Object>)          │
└───────────────────┬────────────────────────────────────┘
                    │
                    ▼ Automated Indexing
┌────────────────────────────────────────────────────────┐
│  Full-Text Search (FTS / Lucene Indexing Engine)       │
│  - Automatically indexes extensionMap.* keys           │
│  - Enables sub-millisecond filtering on custom fields  │
└────────────────────────────────────────────────────────┘
\`\`\``,
    implementation: [
      {
        title: '1. The Dynamic KeyBox Extension Architecture',
        description: 'Encapsulates dynamic, hospital-specific attributes within an extensible KeyBox container that supports typed serialization and automated search indexing.',
        code: `public class KeyBox implements Serializable {
    private final Map<String, Object> extensions = new ConcurrentHashMap<>();

    public void set(String key, Object value) {
        extensions.put(key, value);
    }

    @SuppressWarnings("unchecked")
    public <T> Optional<T> get(String key, Class<T> clazz) {
        Object val = extensions.get(key);
        if (val != null && clazz.isInstance(val)) {
            return Optional.of((T) val);
        }
        return Optional.empty();
    }

    public Map<String, Object> toMap() {
        return Collections.unmodifiableMap(extensions);
    }
}`,
        language: 'java',
      },
      {
        title: '2. GraphQL Resolver Integration for Seamless Client Access',
        description: 'Exposes dynamic extensions directly through GraphQL schemas, allowing frontend React and Android clients to request custom fields without specialized endpoints.',
        code: `@Component
public class AppointmentResolver implements GraphQLResolver<Appointment> {

    public CompletableFuture<String> customField(Appointment appointment, String key) {
        return CompletableFuture.supplyAsync(() -> {
            return appointment.getKeyBox()
                .flatMap(kb -> kb.get(key, String.class))
                .orElse(null);
        });
    }
}`,
        language: 'java',
      },
    ],
    impact: [
      'Onboarded 11+ hospital networks with hundreds of unique custom clinical and operational fields with zero schema alterations.',
      'Maintained 100% strict compliance with international HL7 FHIR R4 exchange standards.',
      'Enabled frontend web and mobile clients to query arbitrary hospital extensions with full-text search indexing support.',
    ],
    lessons: [
      'Healthcare platforms must design for extensibility from day one: international standards define the common vocabulary, but flexible dynamic extension containers (like KeyBox) accommodate local hospital reality.',
      'Pairing schema-less extension containers with search engine indexers (Lucene/FTS) provides the flexibility of NoSQL with the query performance of relational schemas.',
    ],
  },
];
