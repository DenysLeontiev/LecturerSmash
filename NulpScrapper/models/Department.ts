import type { Institute } from "./Institute.js";

export interface Department {
    institute: Institute;
    href: string;
    longName: string;
    shortName: string;
    workersPageHref: string;
}

export function createDepartment(institute: Institute, href: string, fullName: string, shortName: string, workersPageHref: string): Department {
    return { institute, href, longName: fullName, shortName, workersPageHref } as Department;
}