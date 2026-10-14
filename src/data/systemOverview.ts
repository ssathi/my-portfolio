export interface SystemStat {
  label: string;
  value: string;
  subtext: string;
}

export interface TechLayer {
  name: string;
  description: string;
  technologies: string[];
}

export const platformStats: SystemStat[] = [
  { label: 'Total Commits Authored', value: '3,968', subtext: 'Continuous engineering across 7+ years' },
  { label: 'Hospital Clients Deployed', value: '11+', subtext: 'Hemas, Medihelp, Durdans, Singhe, Vision Care...' },
  { label: 'Production PRs Merged', value: '148+', subtext: 'Core repository maintenance & lead review' },
  { label: 'Platform Availability', value: '99.99%', subtext: 'Mission-critical 24/7 hospital uptime' },
];

export const platformLayers: TechLayer[] = [
  {
    name: '1. Presentation & Client Layer',
    description: 'React.js web applications and Android mobile apps for clinical doctors, nurses, hospital billing counters, and patient self-service.',
    technologies: ['React.js', 'Android Native', 'GraphQL (HTTP + WS)', 'FHIR REST R4', 'Tailwind CSS'],
  },
  {
    name: '2. Dynamic Edge & Ingress Layer',
    description: 'Zero-downtime API gateway handling SSL termination, dynamic service discovery, rate limiting, and WebSocket proxying.',
    technologies: ['NGINX OpenResty', 'HashiCorp Consul', 'Consul-Template', 'Lua Rocks', 'Let\'s Encrypt Auto-SSL'],
  },
  {
    name: '3. Core Application & Domain Services',
    description: 'Spring Boot Java microservices orchestrating clinical EMR, doctor channelling, double-entry accounting ledgers, and pharmacy supply chain.',
    technologies: ['Java 17', 'Spring Boot', 'GraphQL Java', 'HL7 FHIR R4', 'Jackson Codec', 'Reactor'],
  },
  {
    name: '4. High-Performance Distributed Storage Layer',
    description: 'Hybrid storage architecture featuring Couchbase document clustering, low-level DCP Change Data Capture, and embedded LSM-tree storage.',
    technologies: ['Couchbase 7.x', 'Couchbase DCP', 'N1QL Query Engine', 'Couchbase FTS', 'Infinispan', 'RocksDB (C++)'],
  },
  {
    name: '5. Analytics & Business Intelligence Pipeline',
    description: 'Decoupled data warehousing and automated visualization for hospital executive reporting and bed occupancy intelligence.',
    technologies: ['Google BigQuery', 'Google Cloud Storage', 'Apache jclouds', 'Docker', 'Metabase BI', 'Apache Superset'],
  },
  {
    name: '6. Infrastructure as Code & Orchestration',
    description: 'Multi-region cloud provisioning on Microsoft Azure and automated configuration management playbooks for hospital deployments.',
    technologies: ['Terraform', 'Azure Resource Manager', 'Site-to-Site IPsec VPN', 'Ansible', 'Ubuntu 24.04 LTS', 'jemalloc'],
  },
];

export const hospitalClients = [
  { name: 'Hemas Hospitals', tier: 'Tertiary Hospital Network', description: 'Multi-site hospital chain with inpatient, surgical, and emergency care.' },
  { name: 'Medihelp Hospitals', tier: 'Nationwide Healthcare Chain', description: 'Extensive outpatient, diagnostic laboratory, and clinical centers.' },
  { name: 'Durdans Hospital', tier: 'Flagship Multispecialty', description: 'Leading hospital center with high-volume clinical and surgical operations.' },
  { name: 'Singhe Hospitals', tier: 'Regional Healthcare Network', description: 'Inpatient wards, outpatient channelling, and 24/7 emergency pharmacy.' },
  { name: 'Vision Care', tier: 'Specialist Optical & Eye Care', description: 'Nationwide optometry, ophthalmic surgery, and retail healthcare network.' },
  { name: 'Maya Healthcare & Moolai Hospital', tier: 'Community & Specialty Clinics', description: 'Dedicated patient care, diagnostic reporting, and channelling.' },
];
