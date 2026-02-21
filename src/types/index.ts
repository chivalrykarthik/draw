// ─── Diagram Types ───
export type DiagramType = 'flow' | 'sequence' | 'architecture';

export interface DiagramTemplate {
    id: string;
    name: string;
    type: DiagramType;
    description: string;
    code: string;
}

export interface DiagramTypeMeta {
    label: string;
    icon: string;
    color: string;
}

// ─── Layout Engine ───
export type LayoutEngine = 'dagre' | 'elk';

// ─── Help Data ───
export interface HelpItem {
    name: string;
    description: string;
    example?: string;
}

export interface CheatSheetItem {
    title: string;
    description: string;
    code: string;
}
