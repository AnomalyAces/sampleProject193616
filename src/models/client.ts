import * as Contentful from '@contentful/rich-text-types';
import { CdaAsset } from "./cda-asset";
import { ClientFAQ } from "./client-faq";

export interface Client {
    name: string;
    logo: CdaAsset;
    aboutUs: Document ;
    contactUs: Document;
    faqs: ClientFAQ[];

}