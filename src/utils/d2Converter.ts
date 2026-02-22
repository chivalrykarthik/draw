/**
 * D2 Code Converter — converts D2 syntax to Mermaid and PlantUML.
 *
 * This is a best-effort converter that handles common D2 patterns:
 * - Node declarations with labels and shapes
 * - Edges with labels and arrow types (→, ←, ↔, --)
 * - Comments
 * - Nested containers (as subgraphs/packages)
 * - Direction declarations
 *
 * Limitations:
 * - Style properties (fill, stroke, font-color) are not portable
 * - Some advanced D2 features (layers, scenarios, globs) are not converted
 */

// ─── Types ───

interface D2Node {
    id: string;
    label: string;
    shape: string;
}

interface D2Edge {
    from: string;
    to: string;
    label: string;
    arrowType: '--' | '->' | '<-' | '<->';
}

interface D2Container {
    id: string;
    label: string;
    children: string[];
}

interface D2ParseResult {
    nodes: Map<string, D2Node>;
    edges: D2Edge[];
    containers: Map<string, D2Container>;
    direction: string;
    comments: string[];
}

// ─── Parser ───

function sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_+|_+$/g, '') || 'node';
}

function parseD2(code: string): D2ParseResult {
    const nodes = new Map<string, D2Node>();
    const edges: D2Edge[] = [];
    const containers = new Map<string, D2Container>();
    const comments: string[] = [];
    let direction = 'right';

    const lines = code.split('\n');
    const containerStack: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        i++;

        // Skip empty lines
        if (!line) continue;

        // Comments
        if (line.startsWith('#')) {
            comments.push(line.slice(1).trim());
            continue;
        }

        // Direction
        const dirMatch = line.match(/^direction\s*:\s*(right|left|up|down)/i);
        if (dirMatch) {
            direction = dirMatch[1].toLowerCase();
            continue;
        }

        // Closing brace — pop container
        if (line === '}') {
            containerStack.pop();
            continue;
        }

        // Edge: A -> B: label  |  A -- B  |  A <- B  |  A <-> B
        const edgeMatch = line.match(/^([^:{}#]+?)\s*(->|<->|<-|--)\s*([^:{}#]+?)(?:\s*:\s*(.+?))?$/);
        if (edgeMatch) {
            const fromRaw = edgeMatch[1].trim();
            const arrowType = edgeMatch[2] as D2Edge['arrowType'];
            const toRaw = edgeMatch[3].trim();
            const label = edgeMatch[4]?.trim() || '';

            const from = fromRaw.replace(/\./g, '_');
            const to = toRaw.replace(/\./g, '_');

            // Register nodes if not seen
            if (!nodes.has(from)) {
                nodes.set(from, { id: sanitizeId(from), label: fromRaw.split('.').pop() || fromRaw, shape: 'rectangle' });
            }
            if (!nodes.has(to)) {
                nodes.set(to, { id: sanitizeId(to), label: toRaw.split('.').pop() || toRaw, shape: 'rectangle' });
            }

            edges.push({ from, to, label, arrowType });
            continue;
        }

        // Container opening: name: { or name { (with label)
        const containerMatch = line.match(/^([a-zA-Z0-9_.\-\s]+?)(?:\s*:\s*\{|\s*\{)\s*$/);
        if (containerMatch) {
            const name = containerMatch[1].trim();
            const id = name.replace(/\./g, '_');
            if (!containers.has(id)) {
                containers.set(id, { id: sanitizeId(id), label: name, children: [] });
            }
            containerStack.push(id);
            continue;
        }

        // Node with label + possible block: name: { ... }
        const blockNodeMatch = line.match(/^([a-zA-Z0-9_.\-]+)\s*:\s*\{\s*$/);
        if (blockNodeMatch) {
            const name = blockNodeMatch[1].trim();
            const id = name.replace(/\./g, '_');

            // This might be a container or a node with properties
            if (!containers.has(id)) {
                containers.set(id, { id: sanitizeId(id), label: name, children: [] });
            }
            containerStack.push(id);

            // Parse properties inside the block
            const nodeObj: D2Node = { id: sanitizeId(id), label: name, shape: 'rectangle' };
            nodes.set(id, nodeObj);
            continue;
        }

        // Property inside a container: label: X, shape: Y, etc.
        if (containerStack.length > 0) {
            const containerId = containerStack[containerStack.length - 1];

            const labelMatch = line.match(/^label\s*:\s*(.+)$/);
            if (labelMatch) {
                const label = labelMatch[1].trim().replace(/^["']|["']$/g, '');
                const container = containers.get(containerId);
                if (container) container.label = label;
                const node = nodes.get(containerId);
                if (node) node.label = label;
                continue;
            }

            const shapeMatch = line.match(/^shape\s*:\s*(.+)$/);
            if (shapeMatch) {
                const node = nodes.get(containerId);
                if (node) node.shape = shapeMatch[1].trim();
                continue;
            }

            // Skip style properties
            if (line.startsWith('style.') || line.startsWith('width:') || line.startsWith('height:') ||
                line.startsWith('near:') || line.startsWith('icon:')) {
                continue;
            }

            // Inline edge inside container
            const innerEdgeMatch = line.match(/^([^:{}#]+?)\s*(->|<->|<-|--)\s*([^:{}#]+?)(?:\s*:\s*(.+?))?$/);
            if (innerEdgeMatch) {
                const fromRaw = innerEdgeMatch[1].trim();
                const arrowType = innerEdgeMatch[2] as D2Edge['arrowType'];
                const toRaw = innerEdgeMatch[3].trim();
                const label = innerEdgeMatch[4]?.trim() || '';

                const from = fromRaw.replace(/\./g, '_');
                const to = toRaw.replace(/\./g, '_');

                if (!nodes.has(from)) {
                    nodes.set(from, { id: sanitizeId(from), label: fromRaw.split('.').pop() || fromRaw, shape: 'rectangle' });
                }
                if (!nodes.has(to)) {
                    nodes.set(to, { id: sanitizeId(to), label: toRaw.split('.').pop() || toRaw, shape: 'rectangle' });
                }

                const container = containers.get(containerId);
                if (container) {
                    if (!container.children.includes(from)) container.children.push(from);
                    if (!container.children.includes(to)) container.children.push(to);
                }

                edges.push({ from, to, label, arrowType });
                continue;
            }

            // Inline node declaration: name: { ... } or name: Label
            const inlineNodeMatch = line.match(/^([a-zA-Z0-9_.\-]+)(?:\s*:\s*(.+?))?$/);
            if (inlineNodeMatch) {
                const name = inlineNodeMatch[1].trim();
                const id = name.replace(/\./g, '_');
                const label = inlineNodeMatch[2]?.trim().replace(/^["']|["']$/g, '') || name;

                if (!nodes.has(id)) {
                    nodes.set(id, { id: sanitizeId(id), label, shape: 'rectangle' });
                } else {
                    const node = nodes.get(id);
                    if (node && inlineNodeMatch[2]) node.label = label;
                }

                const container = containers.get(containerId);
                if (container && !container.children.includes(id)) {
                    container.children.push(id);
                }
                continue;
            }
        }

        // Standalone node: name: Label
        const nodeMatch = line.match(/^([a-zA-Z0-9_.\-]+)\s*:\s*(.+)$/);
        if (nodeMatch && !nodeMatch[2].includes('{')) {
            const name = nodeMatch[1].trim();
            const id = name.replace(/\./g, '_');
            const label = nodeMatch[2].trim().replace(/^["']|["']$/g, '');

            if (!nodes.has(id)) {
                nodes.set(id, { id: sanitizeId(id), label, shape: 'rectangle' });
            } else {
                nodes.get(id)!.label = label;
            }
            continue;
        }
    }

    return { nodes, edges, containers, direction, comments };
}

// ─── Mermaid Converter ───

const D2_SHAPE_TO_MERMAID: Record<string, [string, string]> = {
    'rectangle': ['[', ']'],
    'square': ['[', ']'],
    'circle': ['((', '))'],
    'oval': ['([', '])'],
    'diamond': ['{', '}'],
    'hexagon': ['{{', '}}'],
    'cylinder': ['[(', ')]'],
    'queue': ['[(', ')]'],
    'parallelogram': ['[/', '/]'],
    'document': ['>', ']'],
    'cloud': ['((', '))'],
    'package': ['[', ']'],
    'page': ['[', ']'],
    'class': ['[', ']'],
    'text': ['[', ']'],
    'code': ['[', ']'],
    'stored_data': ['[(', ')]'],
};

function mermaidDirection(d2Dir: string): string {
    switch (d2Dir) {
        case 'right': return 'LR';
        case 'left': return 'RL';
        case 'down': return 'TB';
        case 'up': return 'BT';
        default: return 'LR';
    }
}

function mermaidArrow(arrowType: D2Edge['arrowType']): string {
    switch (arrowType) {
        case '->': return '-->';
        case '<-': return '<--';
        case '<->': return '<-->';
        case '--': return '---';
        default: return '-->';
    }
}

function mermaidNodeDef(node: D2Node): string {
    const [open, close] = D2_SHAPE_TO_MERMAID[node.shape] || ['[', ']'];
    const safeLabel = node.label.replace(/"/g, '#quot;');
    return `    ${node.id}${open}"${safeLabel}"${close}`;
}

export function d2ToMermaid(code: string): string {
    const { nodes, edges, containers, direction, comments } = parseD2(code);
    const lines: string[] = [];

    // Header comment
    lines.push('%% Converted from D2 to Mermaid');
    comments.forEach(c => lines.push(`%% ${c}`));
    lines.push('');

    // Flowchart declaration
    lines.push(`flowchart ${mermaidDirection(direction)}`);
    lines.push('');

    // Track which nodes are inside subgraphs
    const subgraphNodes = new Set<string>();

    // Subgraphs (containers)
    containers.forEach((container) => {
        if (container.children.length === 0) return;
        const safeLabel = container.label.replace(/"/g, '#quot;');
        lines.push(`    subgraph ${container.id}["${safeLabel}"]`);
        container.children.forEach(childId => {
            const node = nodes.get(childId);
            if (node) {
                lines.push(`    ${mermaidNodeDef(node)}`);
                subgraphNodes.add(childId);
            }
        });
        lines.push('    end');
        lines.push('');
    });

    // Standalone nodes (not in subgraphs)
    nodes.forEach((node, id) => {
        if (!subgraphNodes.has(id) && !containers.has(id)) {
            lines.push(mermaidNodeDef(node));
        }
    });
    lines.push('');

    // Edges
    edges.forEach(edge => {
        const fromId = nodes.get(edge.from)?.id || sanitizeId(edge.from);
        const toId = nodes.get(edge.to)?.id || sanitizeId(edge.to);
        const arrow = mermaidArrow(edge.arrowType);
        if (edge.label) {
            const safeLabel = edge.label.replace(/"/g, '#quot;');
            lines.push(`    ${fromId} ${arrow}|"${safeLabel}"| ${toId}`);
        } else {
            lines.push(`    ${fromId} ${arrow} ${toId}`);
        }
    });

    return lines.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');
}

// ─── PlantUML Converter ───

const D2_SHAPE_TO_PLANTUML: Record<string, string> = {
    'rectangle': 'rectangle',
    'square': 'rectangle',
    'circle': 'circle',
    'oval': 'usecase',
    'diamond': 'hexagon',
    'hexagon': 'hexagon',
    'cylinder': 'database',
    'queue': 'queue',
    'cloud': 'cloud',
    'package': 'package',
    'page': 'file',
    'document': 'file',
    'class': 'class',
    'text': 'card',
    'code': 'artifact',
    'stored_data': 'storage',
    'parallelogram': 'rectangle',
};

function plantUmlArrow(arrowType: D2Edge['arrowType']): string {
    switch (arrowType) {
        case '->': return '-->';
        case '<-': return '<--';
        case '<->': return '<-->';
        case '--': return '--';
        default: return '-->';
    }
}

function plantUmlDirection(d2Dir: string): string {
    switch (d2Dir) {
        case 'right': return 'left to right direction';
        case 'left': return 'right to left direction';
        case 'down': return 'top to bottom direction';
        case 'up': return 'top to bottom direction';
        default: return 'left to right direction';
    }
}

export function d2ToPlantUML(code: string): string {
    const { nodes, edges, containers, direction, comments } = parseD2(code);
    const lines: string[] = [];

    // Header
    lines.push("@startuml");
    lines.push("' Converted from D2 to PlantUML");
    comments.forEach(c => lines.push(`' ${c}`));
    lines.push('');
    lines.push(plantUmlDirection(direction));
    lines.push('');

    // Track declared nodes
    const declaredInContainer = new Set<string>();

    // Containers as packages
    containers.forEach((container) => {
        if (container.children.length === 0) return;
        const safeLabel = container.label.replace(/"/g, '');
        lines.push(`package "${safeLabel}" {`);
        container.children.forEach(childId => {
            const node = nodes.get(childId);
            if (node) {
                const shape = D2_SHAPE_TO_PLANTUML[node.shape] || 'rectangle';
                const safeNodeLabel = node.label.replace(/"/g, '');
                lines.push(`    ${shape} "${safeNodeLabel}" as ${node.id}`);
                declaredInContainer.add(childId);
            }
        });
        lines.push('}');
        lines.push('');
    });

    // Standalone nodes
    nodes.forEach((node, id) => {
        if (!declaredInContainer.has(id) && !containers.has(id)) {
            const shape = D2_SHAPE_TO_PLANTUML[node.shape] || 'rectangle';
            const safeLabel = node.label.replace(/"/g, '');
            lines.push(`${shape} "${safeLabel}" as ${node.id}`);
        }
    });
    lines.push('');

    // Edges
    edges.forEach(edge => {
        const fromId = nodes.get(edge.from)?.id || sanitizeId(edge.from);
        const toId = nodes.get(edge.to)?.id || sanitizeId(edge.to);
        const arrow = plantUmlArrow(edge.arrowType);
        if (edge.label) {
            const safeLabel = edge.label.replace(/"/g, '');
            lines.push(`${fromId} ${arrow} ${toId} : ${safeLabel}`);
        } else {
            lines.push(`${fromId} ${arrow} ${toId}`);
        }
    });

    lines.push('');
    lines.push("@enduml");

    return lines.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');
}

// ─── Download Helpers ───

function downloadText(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function downloadMermaid(d2Code: string, filename: string = 'd2-diagram') {
    const mermaid = d2ToMermaid(d2Code);
    downloadText(mermaid, `${filename}.mmd`);
}

export function downloadPlantUML(d2Code: string, filename: string = 'd2-diagram') {
    const puml = d2ToPlantUML(d2Code);
    downloadText(puml, `${filename}.puml`);
}
