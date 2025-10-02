import type { Department } from "./Department.js";

export interface Worker {
    imageUrl: string;
    fullName: string;
    position: string;
    personalPageHref: string;
    department: Department;
}

export function createWorker(imageUrl: string, fullName: string, position: string, personalPageHref: string, department: Department): Worker {
    return { imageUrl, fullName, position, personalPageHref, department } as Worker;
}