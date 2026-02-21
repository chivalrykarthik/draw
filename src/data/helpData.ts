import type { HelpItem, CheatSheetItem } from '../types';

export const GENERAL_PROPERTIES: HelpItem[] = [
    { name: 'direction', description: 'Sets the layout direction of the diagram (right, left, up, down)', example: 'direction: right' },
    { name: 'shape', description: 'The visual shape of the object (see Shapes tab)', example: 'server: { shape: cloud }' },
    { name: 'label', description: 'The text displayed on the object. Defaults to the object key if omitted.', example: 'db: { label: "PostgreSQL" }' },
    { name: 'description', description: 'Adds a description to the object (often used for accessibility)', example: 'db: { description: "Main database" }' },
    { name: 'tooltip', description: 'Shows text when hovering over the object', example: 'api: { tooltip: "Handles auth requests" }' },
    { name: 'link', description: 'Makes the object clickable, opening the URL', example: 'github: { link: "https://github.com" }' },
    { name: 'icon', description: 'Adds an icon to the object (requires icon set)', example: 'user: { icon: material/person }' },
    { name: 'width', description: 'Sets a fixed width for the object (pixels)', example: 'box: { width: 200 }' },
    { name: 'height', description: 'Sets a fixed height for the object (pixels)', example: 'box: { height: 100 }' },
    { name: 'near', description: 'Tries to place the object near another object (Tala engine only)', example: 'b: { near: a }' },
];

export const STYLE_PROPERTIES: HelpItem[] = [
    { name: 'style.fill', description: 'Background color of the shape', example: 'style.fill: "#f472b6"' },
    { name: 'style.stroke', description: 'Border color of the shape or connection', example: 'style.stroke: "#333"' },
    { name: 'style.stroke-width', description: 'Thickness of the border/line', example: 'style.stroke-width: 4' },
    { name: 'style.stroke-dash', description: 'Creates a dashed border/line', example: 'style.stroke-dash: 3' },
    { name: 'style.opacity', description: 'Transparency (0.0 to 1.0)', example: 'style.opacity: 0.5' },
    { name: 'style.shadow', description: 'Adds a drop shadow (true/false)', example: 'style.shadow: true' },
    { name: 'style.border-radius', description: 'Rounds the corners of the shape', example: 'style.border-radius: 10' },
    { name: 'style.font-size', description: 'Size of the label text', example: 'style.font-size: 20' },
    { name: 'style.font-color', description: 'Color of the label text', example: 'style.font-color: "#fff"' },
    { name: 'style.bold', description: 'Makes the label text bold', example: 'style.bold: true' },
    { name: 'style.italic', description: 'Makes the label text italic', example: 'style.italic: true' },
    { name: 'style.underline', description: 'Underlines the label text', example: 'style.underline: true' },
];

export const SHAPES_LIST = [
    { name: 'rectangle', desc: 'Generic containers, services, web servers.' },
    { name: 'square', desc: 'Compact nodes, servers, simple elements.' },
    { name: 'page', desc: 'HTML pages, web documents, reports.' },
    { name: 'parallelogram', desc: 'Input/Output operations, data transformation.' },
    { name: 'document', desc: 'Files, scripts, configs.' },
    { name: 'cylinder', desc: 'Databases, storage, disks, cache (Redis).' },
    { name: 'queue', desc: 'Message queues (Kafka, RabbitMQ), stacks.' },
    { name: 'package', desc: 'Code packages, libraries, groupings.' },
    { name: 'step', desc: 'Process steps, sequential actions.' },
    { name: 'callout', desc: 'Notes, comments, annotations.' },
    { name: 'person', desc: 'Users, actors (alias: actor), roles, customers.' },
    { name: 'diamond', desc: 'Decisions, conditionals, branching.' },
    { name: 'oval', desc: 'Start/end points, state terminators.' },
    { name: 'circle', desc: 'Small nodes, points, connectors.' },
    { name: 'hexagon', desc: 'Microservices, APIs, serverless functions.' },
    { name: 'cloud', desc: 'Internet, AWS/Azure/GCP, external networks.' },
    { name: 'text', desc: 'Plain text labels, titles, notes.' },
    { name: 'code', desc: 'Code snippets, monospaced text blocks.' },
    { name: 'blockquote', desc: 'Quotes, external references, highlighted text.' },
    { name: 'class', desc: 'UML Classes with fields/methods.' },
    { name: 'sql_table', desc: 'Database tables with types/constraints.' },
    { name: 'image', desc: 'Embeds an image (use with icon property).' },
];

export const CHEAT_SHEETS: CheatSheetItem[] = [
    {
        title: 'Database / ERD',
        description: 'Define tables with typed columns & constraints',
        code: `users: {
  shape: sql_table
  id: int {constraint: primary_key}
  username: varchar(50)
  email: varchar(100) {constraint: unique}
}
orders: {
  shape: sql_table
  id: int {constraint: primary_key}
  user_id: int {constraint: foreign_key}
}
users -> orders: has many`,
    },
    {
        title: 'UML Class',
        description: 'Classes with fields and methods',
        code: `User: {
  shape: class
  +id: UUID
  -password: String
  +login(): void
}
Admin: {
  shape: class
  +permissions: List<String>
}
Admin -> User: inherits`,
    },
    {
        title: 'Connections',
        description: 'Various arrow styles and labels',
        code: `a -> b: Solid Arrow
a -- b: No Arrowhead
a <-> b: Bidirectional
a -> b: Dashed {
  style.stroke-dash: 3
  style.stroke: red
}`,
    },
    {
        title: 'Containers',
        description: 'Grouping objects seamlessly',
        code: `aws: {
  style.fill: "#f8fafc"
  style.stroke: "#e2e8f0"
  
  lb: { shape: rectangle }
  api: { shape: rectangle }
  
  lb -> api: Traffic
}`,
    },
];
