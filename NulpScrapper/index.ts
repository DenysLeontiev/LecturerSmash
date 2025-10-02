import * as cheerio from 'cheerio'
import { createInstitute, type Institute } from './models/Institute.js';
import { createDepartment, type Department } from './models/Department.js';
import { createWorker, type Worker } from './models/Worker.js';
import { writeFile } from 'fs/promises';

const nulpUrl: string = "https://lpnu.ua";
const institutesUrl: string = "https://lpnu.ua/institutes";

const workersPageHref: string = '/kolektyv-pratsivnykiv-kafedry';

const fileName: string = 'ouput.json';
const defaultWorkerImagePlaceholder: string = "defphoto2";

const institutes: Institute[] = [];
const departments: Department[] = [];
const workers: Worker[] = [];

let $: any;

await main();

async function main() {
    await fetchInstitutes();

    await fetchCafedras(institutes);

    await fetchWorkers(departments);

    const json: string = JSON.stringify(workers);

    await writeFile(fileName, json);
}

async function fetchInstitutes() {
    try {
        const response = await fetch(institutesUrl);

        const html: string = await response.text();

        $ = cheerio.load(html);

        $('.item-list').each((i: number, element: any) => {

            const $itemList = $(element);

            const insituteName: string = $itemList.find('h3').text().trim()
            const instituteHref: string = $itemList.find('a').attr('href');

            const fullInstituteHref: string = `${nulpUrl}${instituteHref}`;

            institutes.push(createInstitute(insituteName, fullInstituteHref));
        });

    } catch (err) {
        console.error(err);
    }
}

async function fetchCafedras(institutes: Institute[]) {

    for (let i = 0; i < institutes.length; i++) {
        let institute: Institute = institutes[i]!;

        try {
            const response = await fetch(`${institute.href}`);

            const html: string = await response.text();

            $ = cheerio.load(html);

            $('.item-list > ul > li > div > div > a').each((i: number, element: any) => {

                const href: string = $(element).attr('href').trim();
                const fullName: string = $(element).clone().children('strong').remove().end().text().trim();
                const shortName: string = $(element).find('strong').text();
                const fullWorkersPageHref: string = `${href}${workersPageHref}`;

                departments.push(createDepartment(institute, href, fullName, shortName, fullWorkersPageHref));
            });

        } catch (error) {
            console.log(error);
        }
    }
}

async function fetchWorkers(departments: Department[]) {

    for (let i = 0; i < departments.length; i++) {
        const department: Department = departments[i]!;

        const workersUrl: string = `${department.workersPageHref}`;

        try {
            const response = await fetch(workersUrl);

            const html: string = await response.text();

            $ = cheerio.load(html);

            $('.field-content').each((i: number, element: any) => {

                const workerImage: string = $(element).find('.dep_staff_photo').attr('src');
                const workerFullName: string = $(element).find('.dep_staff_info > h3').text().trim();
                const workerPosition: string = $(element).find('.dep_staff_infod').text().trim();
                const workerPersonalPageHref: string = $(element).find('.dep_staff_info > h3 > a').attr('href');

                const fullWorkerImage: string = `${nulpUrl}${workerImage}`;

                if (workerImage && workerFullName) {
                    workers.push(createWorker(fullWorkerImage, workerFullName, workerPosition, workerPersonalPageHref, department));
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
}