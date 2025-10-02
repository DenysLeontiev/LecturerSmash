import type { Institute } from "./Institute.js";
export interface Department {
    institute: Institute;
    href: string;
    longName: string;
    shortName: string;
    workersPageHref: string;
}
export declare function createDepartment(institute: Institute, href: string, fullName: string, shortName: string, workersPageHref: string): Department;
//# sourceMappingURL=Department.d.ts.map