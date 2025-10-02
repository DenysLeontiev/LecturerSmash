import type { Department } from "./Department.js";
export interface Worker {
    imageUrl: string;
    fullName: string;
    position: string;
    personalPageHref: string;
    department: Department;
}
export declare function createWorker(imageUrl: string, fullName: string, position: string, personalPageHref: string, department: Department): Worker;
//# sourceMappingURL=Worker.d.ts.map