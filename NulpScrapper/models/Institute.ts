export interface Institute {
    name: string;
    href: string;
}

export function createInstitute(name: string, href: string): Institute {
    return { name, href } as Institute;
}